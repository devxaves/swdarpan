"use client";
import Breadcrumb from "./Headerm";
import MoleculeStructure from "../molecule-bank/Model"; // Import MoleculeStructure
import React, { useState } from "react";
import { BrainIcon, HeartPulseIcon, NotepadTextIcon, StethoscopeIcon } from "lucide-react";

const ModalLayout = () => {
  const [smiles, setSmiles] = useState(
    "CCN(CC)C(=O)[C@@]1(C)Nc2c(ccc3ccccc23)C[C@H]1N(C)C"
  );
  const [numMolecules, setNumMolecules] = useState("10");
  const [minSimilarity, setMinSimilarity] = useState("0.3");
  const [particles, setParticles] = useState("30");
  const [iterations, setIterations] = useState("10");
  const [molecules, setMolecules] = useState<{ structure: string; score: number }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      algorithm: "CMA-ES",
      num_molecules: parseInt(numMolecules),
      property_name: "QED",
      minimize: false,
      min_similarity: parseFloat(minSimilarity),
      particles: parseInt(particles),
      iterations: parseInt(iterations),
      smi: smiles,
    };

    try {
      const response = await fetch("/api/nvidia", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log("Response Text:", responseText);

      const data = JSON.parse(responseText);
      const generatedMolecules = JSON.parse(data.molecules).map((mol: any) => ({
        structure: mol.sample,
        score: mol.score,
      }));

      console.log("Generated Molecules:", generatedMolecules);
      setMolecules(generatedMolecules);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Breadcrumb pageName="Generate Molecules" />

      <div className="gap-9 grid grid-cols-1 sm:grid-cols-3">
        <div className="flex flex-col gap-9 sm:col-span-2">
          <div className="border-stroke dark:border-[#121212] bg-white dark:bg-[#181818] shadow-xl hover:shadow-2xl border rounded-lg transition-transform duration-500 hover:scale-105">
            <div className="border-stroke dark:border-strokedark bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 px-6.5 py-4 border-b rounded-t-lg text-white">
              <h3 className="font-bold text-center text-lg uppercase tracking-wider">
                SMILES to Molecule Generator
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6 p-6.5">
                {/* Input fields for SMILES, numMolecules, etc. */}
                <div className="flex xl:flex-row flex-col gap-6">
                  <div className="w-full xl:w-1/2">
                    <label className="block mb-3 font-medium text-gray-800 text-sm dark:text-gray-300">
                      SMILES String
                    </label>
                    <input
                      type="text"
                      value={smiles}
                      onChange={(e) => setSmiles(e.target.value)}
                      placeholder="Enter SMILES string"
                      className="border-[1.5px] border-gray-300 focus:border-indigo-600 dark:border-gray-2 bg-gray-50 dark:bg-[#181818] px-5 py-3 rounded-lg focus:ring-2 focus:ring-indigo-200 w-full text-black dark:text-white transition outline-none"
                    />
                  </div>

                  <div className="w-full xl:w-1/2">
                    <label className="block mb-3 font-medium text-gray-800 text-sm dark:text-gray-300">
                      Number of Molecules
                    </label>
                    <input
                      type="text"
                      value={numMolecules}
                      onChange={(e) => setNumMolecules(e.target.value)}
                      placeholder="Enter number of molecules"
                      className="border-[1.5px] border-gray-300 focus:border-indigo-600 dark:border-gray-2 bg-gray-50 dark:bg-[#181818] px-5 py-3 rounded-lg focus:ring-2 focus:ring-indigo-200 w-full text-black dark:text-white transition outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block font-medium text-gray-800 text-sm dark:text-gray-300">
                      Minimum Similarity
                    </label>
                    <input
                      type="text"
                      value={minSimilarity}
                      onChange={(e) => setMinSimilarity(e.target.value)}
                      placeholder="Enter minimum similarity"
                      className="border-[1.5px] border-gray-300 focus:border-indigo-600 dark:border-gray-2 bg-gray-50 dark:bg-[#181818] px-5 py-3 rounded-lg focus:ring-2 focus:ring-indigo-200 w-full text-black dark:text-white transition outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-800 text-sm dark:text-gray-300">
                      Particles
                    </label>
                    <input
                      type="text"
                      value={particles}
                      onChange={(e) => setParticles(e.target.value)}
                      placeholder="Enter number of particles"
                      className="border-[1.5px] border-gray-300 focus:border-indigo-600 dark:border-gray-2 bg-gray-50 dark:bg-[#181818] px-5 py-3 rounded-lg focus:ring-2 focus:ring-indigo-200 w-full text-black dark:text-white transition outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-gray-800 text-sm dark:text-gray-300">
                      Iterations
                    </label>
                    <input
                      type="text"
                      value={iterations}
                      onChange={(e) => setIterations(e.target.value)}
                      placeholder="Enter number of iterations"
                      className="border-[1.5px] border-gray-300 focus:border-indigo-600 dark:border-gray-2 bg-gray-50 dark:bg-[#181818] px-5 py-3 rounded-lg focus:ring-2 focus:ring-indigo-200 w-full text-black dark:text-white transition outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:bg-opacity-80 shadow-lg p-3 rounded-lg w-full font-medium text-white transform transition duration-300 hover:scale-105"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Molecules"}
                </button>
              </div>
            </form>
          </div>

          {/* Render molecules with MoleculeStructure component */}
          <div className="mt-6">
            {molecules.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Generated Molecules</h3>
                {molecules.map((mol, index) => (
                  <div key={index} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-[#181818]">
                    <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
                      <strong>SMILES:</strong> {mol.structure}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <strong>Score:</strong> {mol.score.toFixed(4)}
                    </div>
                    {/* Render the molecule image using MoleculeStructure */}
                    <MoleculeStructure
                      id={`molecule-${index}`}
                      structure={mol.structure}
                      width={250}
                      height={200}
                      scores={mol.score}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                No molecules generated yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalLayout;