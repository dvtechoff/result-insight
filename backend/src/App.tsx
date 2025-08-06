import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ResultData {
  rollNo: string;
  enrollmentNo: string;
  fullName: string;
  fatherName: string;
  course: string;
  branch: string;
  SGPA: Record<string, number>;
  CarryOvers: any[];
  divison: string;
  cgpa: string;
  instituteName: string;
  Subjects: any[];
  latestResultStatus: string;
  totalMarksObtained: number;
  latestCOP: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 18 } },
  exit: { opacity: 0, y: 40, transition: { duration: 0.3 } },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 * i, duration: 0.5 } }),
};

function App() {
  const [rollNo, setRollNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResultData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/result?rollNo=${rollNo}`);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Unknown error");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-white flex flex-col items-center justify-start p-0">
      {/* Hero Header */}
      <header className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 py-10 shadow-lg mb-8">
        <div className="max-w-2xl mx-auto px-4 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center mb-2 tracking-tight animate-fade-in">
            Singularity Result Portal
          </h1>
          <p className="text-lg text-indigo-100 text-center mb-4 animate-fade-in delay-100">
            Enter your roll number to view your academic results instantly
          </p>
        </div>
      </header>
      {/* Form Card */}
      <motion.div
        className="bg-white/90 shadow-2xl rounded-2xl p-8 w-full max-w-lg mb-8 border border-indigo-100 backdrop-blur-md"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Roll Number"
            value={rollNo}
            onChange={e => setRollNo(e.target.value)}
            className="border border-indigo-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
            required
            autoFocus
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-bold py-3 rounded-lg shadow hover:scale-105 hover:shadow-lg transition-all duration-200 text-lg disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
                Fetching...
              </span>
            ) : "Get Result"}
          </button>
        </form>
        {error && <motion.div className="text-red-600 text-center mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{error}</motion.div>}
      </motion.div>
      {/* Result Card */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            className="w-full max-w-3xl bg-white/95 rounded-2xl shadow-2xl border border-indigo-100 p-8 mb-12 animate-fade-in"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            {/* Profile Section */}
            <motion.div className="flex flex-col md:flex-row md:items-center gap-6 mb-8" custom={0} variants={sectionVariants} initial="hidden" animate="visible">
              <div className="flex-1">
                <div className="text-2xl font-bold text-indigo-700 mb-1">{result.fullName}</div>
                <div className="text-gray-700 mb-1">Roll No: <span className="font-semibold">{result.rollNo}</span></div>
                <div className="text-gray-700 mb-1">Enrollment No: <span className="font-semibold">{result.enrollmentNo}</span></div>
                <div className="text-gray-700 mb-1">Father's Name: <span className="font-semibold">{result.fatherName}</span></div>
                <div className="text-gray-700 mb-1">Course: <span className="font-semibold">{result.course}</span></div>
                <div className="text-gray-700 mb-1">Branch: <span className="font-semibold">{result.branch}</span></div>
                <div className="text-gray-700 mb-1">Institute: <span className="font-semibold">{result.instituteName}</span></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="rounded-full bg-gradient-to-br from-indigo-400 to-blue-300 w-28 h-28 flex items-center justify-center shadow-lg border-4 border-white">
                  <span className="text-4xl font-extrabold text-white drop-shadow">{result.fullName[0]}</span>
                </div>
                <div className="text-xs text-gray-400 mt-2">Student</div>
              </div>
            </motion.div>
            {/* SGPA Section */}
            <motion.div className="bg-indigo-50 rounded-xl p-4 shadow mb-6" custom={1} variants={sectionVariants} initial="hidden" animate="visible">
              <div className="font-semibold mb-2 text-indigo-700">SGPA</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(result.SGPA).map(([sem, sgpa]) => (
                  <div key={sem} className="bg-indigo-200 px-4 py-1 rounded text-indigo-900 text-sm font-semibold shadow">
                    {sem.toUpperCase()}: {sgpa}
                  </div>
                ))}
              </div>
            </motion.div>
            {/* Subjects Table */}
            <motion.div className="bg-white rounded-xl p-4 shadow mb-6 overflow-x-auto" custom={2} variants={sectionVariants} initial="hidden" animate="visible">
              <div className="font-semibold mb-2 text-indigo-700">Subjects</div>
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-1">Subject</th>
                    <th className="px-2 py-1">Code</th>
                    <th className="px-2 py-1">Type</th>
                    <th className="px-2 py-1">Internal</th>
                    <th className="px-2 py-1">External</th>
                  </tr>
                </thead>
                <tbody>
                  {result.Subjects.map((sub, idx) => (
                    <tr key={idx} className="even:bg-indigo-50">
                      <td className="px-2 py-1 font-medium text-gray-800">{sub.subject}</td>
                      <td className="px-2 py-1">{sub.code}</td>
                      <td className="px-2 py-1">{sub.type}</td>
                      <td className="px-2 py-1">{sub.internal}</td>
                      <td className="px-2 py-1">{sub.external}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
            {/* Carry Overs */}
            <motion.div className="bg-white rounded-xl p-4 shadow mb-6" custom={3} variants={sectionVariants} initial="hidden" animate="visible">
              <div className="font-semibold mb-2 text-indigo-700">Carry Overs</div>
              {result.CarryOvers.length === 0 || (result.CarryOvers.length === 1 && result.CarryOvers[0][0] === "No Backlogs") ? (
                <div className="text-green-600 font-semibold">No Backlogs</div>
              ) : (
                <ul className="list-disc pl-5">
                  {result.CarryOvers.map((co, idx) => (
                    <li key={idx} className="text-gray-700">
                      {co.session} | Sem: {co.sem} | {co.cop}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
            {/* Summary Section */}
            <motion.div className="bg-gradient-to-r from-indigo-100 to-blue-50 rounded-xl p-4 shadow flex flex-wrap gap-6" custom={4} variants={sectionVariants} initial="hidden" animate="visible">
              <div>
                <span className="font-semibold text-indigo-700">Division:</span> {result.divison || "-"}
              </div>
              <div>
                <span className="font-semibold text-indigo-700">CGPA:</span> {result.cgpa || "-"}
              </div>
              <div>
                <span className="font-semibold text-indigo-700">Total Marks:</span> {result.totalMarksObtained || "-"}
              </div>
              <div>
                <span className="font-semibold text-indigo-700">Latest COP:</span> {result.latestCOP || "-"}
              </div>
              <div>
                <span className="font-semibold text-indigo-700">Latest Result Status:</span> {result.latestResultStatus || "-"}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Footer */}
      <footer className="w-full text-center text-gray-400 py-6 mt-auto text-sm">
        &copy; {new Date().getFullYear()} Singularity Result Portal. All rights reserved.
      </footer>
    </div>
  );
}

export default App;