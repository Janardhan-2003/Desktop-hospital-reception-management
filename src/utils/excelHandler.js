import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const EXCEL_FILE_NAME = 'patients.xlsx';
const EXCEL_FILE_PATH = path.join(os.homedir(), 'Documents', 'PatientManagement', EXCEL_FILE_NAME);
const FOLDER_PATH = path.dirname(EXCEL_FILE_PATH);

const HEADERS = [
  'Date', 'IP No', 'S.No', 'Name', 'Age', 'Phone',
  'Place', 'Referral Name', 'Referral Phone'
];

// Initialize Excel file with headers
export const initializeExcelFile = async () => {
  try {
    console.log('MAIN: Initializing Excel file at:', EXCEL_FILE_PATH);
    await fs.mkdir(FOLDER_PATH, { recursive: true });
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(worksheet, [HEADERS], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Patients');
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    await fs.writeFile(EXCEL_FILE_PATH, buffer);
    
    console.log('MAIN: Excel file created successfully');
    return true;
  } catch (error) {
    console.error('MAIN: Error initializing Excel file:', error);
    return false;
  }
};

// Check if Excel file exists
export const checkExcelFileExists = async () => {
  try {
    await fs.access(EXCEL_FILE_PATH);
    console.log('MAIN: Excel file exists');
    return true;
  } catch {
    console.log('MAIN: Excel file does not exist');
    return false;
  }
};

// Read patients from Excel
export const readPatientsFromExcel = async () => {
  try {
    console.log('MAIN: Reading patients from Excel');
    
    const exists = await checkExcelFileExists();
    if (!exists) {
      console.log('MAIN: No Excel file, returning empty array');
      return [];
    }

    const buffer = await fs.readFile(EXCEL_FILE_PATH);
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets['Patients'];
    
    if (!worksheet) {
      console.log('MAIN: No Patients sheet found');
      return [];
    }
    
    // Use sheet_to_json with header: 1 to get array of arrays (compatible with older XLSX)
    const allData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log('MAIN: Read', allData.length, 'rows from Excel');
    
    if (allData.length <= 1) {
      console.log('MAIN: Only headers or empty file');
      return [];
    }
    
    // Convert to objects, skipping header row
    const patients = [];
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      if (row[3] && row[3].toString().trim()) { // Check if name exists and not empty
        patients.push({
          date: row[0] || '',
          ipNo: row[1] || '',
          sNo: row[2] || '',
          name: row[3] || '',
          age: row[4] || '',
          phone: row[5] || '',
          place: row[6] || '',
          referralName: row[7] || '',
          referralPhone: row[8] || ''
        });
      }
    }
    
    console.log('MAIN: Parsed', patients.length, 'valid patients');
    return patients.reverse(); // latest first
  } catch (error) {
    console.error('MAIN: Error reading from Excel:', error);
    return [];
  }
};

// Write a new patient to Excel
export const writePatientToExcel = async (patient) => {
  console.log('MAIN: ===== WRITE PATIENT START =====');
  console.log('MAIN: Patient data received:', patient);
  
  try {
    // Ensure file exists
    const exists = await checkExcelFileExists();
    if (!exists) {
      console.log('MAIN: Creating Excel file first...');
      const created = await initializeExcelFile();
      if (!created) {
        throw new Error('Failed to create Excel file');
      }
    }

    // Read existing file
    console.log('MAIN: Reading existing Excel file...');
    const buffer = await fs.readFile(EXCEL_FILE_PATH);
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets['Patients'];
    
    if (!worksheet) {
      throw new Error('Patients worksheet not found');
    }

    // Get existing data using sheet_to_json with header: 1 (compatible with older XLSX)
    const existingData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log('MAIN: Existing rows:', existingData.length);

    // Add new patient row
    const newRow = [
      patient.date,
      patient.ipNo,
      patient.sNo,
      patient.name,
      patient.age,
      patient.phone || '',
      patient.place,
      patient.referralName || '',
      patient.referralPhone || ''
    ];
    
    console.log('MAIN: Adding new row:', newRow);
    existingData.push(newRow);

    // Create new worksheet using json_to_sheet and add data with sheet_add_aoa
    console.log('MAIN: Creating new worksheet...');
    const newWorksheet = XLSX.utils.json_to_sheet([]);
    XLSX.utils.sheet_add_aoa(newWorksheet, existingData, { origin: 'A1' });
    workbook.Sheets['Patients'] = newWorksheet;

    console.log('MAIN: Writing to file...');
    const newBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    await fs.writeFile(EXCEL_FILE_PATH, newBuffer);

    console.log('MAIN: ===== WRITE SUCCESS =====');
    return true;
  } catch (error) {
    console.error('MAIN: ===== WRITE FAILED =====');
    console.error('MAIN: Error:', error.message);
    console.error('MAIN: Stack:', error.stack);
    return false;
  }
};

// Export function - Enhanced with better error handling and logging
export const exportToExcel = async (patients, filename = 'patients_export.xlsx') => {
  try {
    console.log('MAIN: Starting export of', patients.length, 'patients');
    console.log('MAIN: Export filename:', filename);
    
    // Ensure Downloads folder exists
    const downloadsPath = path.join(os.homedir(), 'Downloads');
    await fs.mkdir(downloadsPath, { recursive: true });
    
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([]);
    
    // Prepare data for export
    const exportData = [HEADERS];
    
    // Add patient data
    patients.forEach(patient => {
      exportData.push([
        patient.date || '',
        patient.ipNo || '',
        patient.sNo || '',
        patient.name || '',
        patient.age || '',
        patient.phone || '',
        patient.place || '',
        patient.referralName || '',
        patient.referralPhone || ''
      ]);
    });
    
    console.log('MAIN: Prepared', exportData.length - 1, 'patient rows for export');
    
    // Add data to worksheet
    XLSX.utils.sheet_add_aoa(worksheet, exportData, { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Patients');

    // Generate export path
    const exportPath = path.join(downloadsPath, filename);
    console.log('MAIN: Export path:', exportPath);
    
    // Write file
    XLSX.writeFile(workbook, exportPath);

    console.log('MAIN: ===== EXPORT SUCCESS =====');
    console.log('MAIN: Patients exported to:', exportPath);
    return exportPath;
  } catch (error) {
    console.error('MAIN: ===== EXPORT FAILED =====');
    console.error('MAIN: Export error:', error.message);
    console.error('MAIN: Stack:', error.stack);
    return false;
  }
};