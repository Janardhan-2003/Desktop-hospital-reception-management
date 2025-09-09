import { useState, useEffect } from "react";
import {
  isToday,
  isThisWeek,
  isThisMonth,
  getCurrentDateTime,
} from "./utils/dateUtils";
import Navbar from "./components/Navbar";
import StatsCards from "./components/StatsCards";
import FilterSection from "./components/FilterSection";
import PatientTable from "./components/PatientTable";
import AddPatientModal from "./components/AddPatientModal";
import ViewPatientModal from "./components/ViewPatientModal";

function App() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  });
  const [currentFilters, setCurrentFilters] = useState({});

  // Load patients from Excel
  const loadPatientsFromExcel = async () => {
    try {
      setLoading(true);

      // Ensure Excel file exists
      const exists = await window.api?.checkExcelExists();
      if (!exists) {
        console.log("Initializing Excel file...");
        await window.api?.initializeExcelFile();
      }

      // Load patients from Excel
      const excelPatients = await window.api?.readPatients();
      const loadedPatients = Array.isArray(excelPatients) ? excelPatients : [];

      console.log("Loaded patients:", loadedPatients);
      setPatients(loadedPatients);
      setFilteredPatients(loadedPatients); // show all initially
    } catch (error) {
      console.error("Error loading patients:", error);
      alert(`Error loading patients: ${error.message}`);
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Load patients on mount
  useEffect(() => {
    loadPatientsFromExcel();
  }, []);

  // Update filtered patients when patients or filters change
  useEffect(() => {
    applyFilters();
  }, [patients, currentFilters]);

  // Update stats when patients change
  useEffect(() => {
    calculateStats();
  }, [patients]);

  // Calculate stats
  const calculateStats = () => {
    const todayCount = patients.filter((p) => isToday(p.date)).length;
    const weekCount = patients.filter((p) => isThisWeek(p.date)).length;
    const monthCount = patients.filter((p) => isThisMonth(p.date)).length;

    setStats({
      today: todayCount,
      week: weekCount,
      month: monthCount,
      total: patients.length,
    });
  };

  // Generate next S.No and IP No
  const generateNextNumbers = () => {
    const todayPatients = patients.filter((p) => isToday(p.date));
    const nextSNo = (todayPatients.length + 1).toString();
    const nextIpNo = `IP${nextSNo.padStart(3, "0")}`;
    return { nextSNo, nextIpNo };
  };

  // Handle adding a new patient - Excel first approach
  const handleAddPatient = async (patientData) => {
    try {
      setLoading(true);

      const { nextSNo, nextIpNo } = generateNextNumbers();
      const newPatient = {
        date: getCurrentDateTime(),
        ipNo: nextIpNo,
        sNo: nextSNo,
        ...patientData,
      };

      // Write to Excel first
      // In handleAddPatient, right before window.api?.writePatient:
      console.log("About to write patient:", newPatient);
      console.log("window.api exists:", !!window.api);
      console.log("writePatient function exists:", !!window.api?.writePatient);
      const success = await window.api?.writePatient(newPatient);
      if (!success) {
        throw new Error("Failed to write patient to Excel");
      }

      // Reload all data from Excel to ensure consistency
      await loadPatientsFromExcel();

      // Modal will handle closing itself on success
    } catch (error) {
      console.error("Error adding patient:", error);
      // Re-throw error so modal can handle it
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Apply filters to patient table
  const applyFilters = () => {
    let filtered = [...patients];

    if (currentFilters.name) {
      filtered = filtered.filter(
        (p) =>
          p.name &&
          p.name.toLowerCase().includes(currentFilters.name.toLowerCase())
      );
    }

    if (currentFilters.place) {
      filtered = filtered.filter(
        (p) =>
          p.place &&
          p.place.toLowerCase().includes(currentFilters.place.toLowerCase())
      );
    }

    if (currentFilters.date) {
      filtered = filtered.filter((p) => {
        if (!p.date) return false;
        try {
          return (
            new Date(p.date).toDateString() ===
            new Date(currentFilters.date).toDateString()
          );
        } catch {
          return false;
        }
      });
    }

    if (currentFilters.age) {
      filtered = filtered.filter(
        (p) => p.age && p.age.toString() === currentFilters.age.toString()
      );
    }

    if (currentFilters.referralName) {
      filtered = filtered.filter(
        (p) =>
          p.referralName &&
          p.referralName
            .toLowerCase()
            .includes(currentFilters.referralName.toLowerCase())
      );
    }

    if (currentFilters.ipNo) {
      filtered = filtered.filter(
        (p) =>
          p.ipNo &&
          p.ipNo.toLowerCase().includes(currentFilters.ipNo.toLowerCase())
      );
    }

    setFilteredPatients(filtered);
  };

  const handleFilter = (filters) => setCurrentFilters(filters);

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  // Handle Excel download with unique filename
  const handleDownloadExcel = async () => {
    try {
      setLoading(true);
      
      // Generate unique filename with timestamp
      const now = new Date();
      const timestamp = now.toISOString()
        .replace(/[:.]/g, '-')
        .slice(0, 19); // YYYY-MM-DDTHH-MM-SS
      
      const hasFilters = Object.keys(currentFilters).some(key => currentFilters[key]);
      const prefix = hasFilters ? 'filtered_patients' : 'all_patients';
      const filename = `${prefix}_export_${timestamp}.xlsx`;
      
      // Use existing exportToExcel function
      const result = await window.api?.exportToExcel(filteredPatients, filename);
      
      if (result) {
        alert(`Successfully exported ${filteredPatients.length} patients to Downloads folder as "${filename}"`);
      } else {
        alert('Failed to export patients. Please try again.');
      }
    } catch (error) {
      console.error("Error downloading Excel:", error);
      alert(`Error exporting patients: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data manually
  const handleRefresh = () => {
    loadPatientsFromExcel();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onAddPatient={() => setShowAddModal(true)}
        onRefresh={handleRefresh}
        loading={loading}
      />

      <main>
        <StatsCards stats={stats} />
        <FilterSection onFilter={handleFilter} />
        <PatientTable
          patients={filteredPatients}
          onViewPatient={handleViewPatient}
          onDownloadExcel={handleDownloadExcel}
          loading={loading}
        />
      </main>

      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddPatient={handleAddPatient}
        loading={loading}
      />

      <ViewPatientModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        patient={selectedPatient}
      />
    </div>
  );
}

export default App;