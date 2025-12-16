import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../../context/ThemeContext';
import { FiDownload, FiChevronDown, FiInfo } from 'react-icons/fi';

const ExportAnalyticsReport = () => {
  const { isDark } = useContext(ThemeContext);
  const [selectedFormat, setSelectedFormat] = useState('PDF Document');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const exportFormats = [
    'PDF Document',
    'Excel Spreadsheet',
    'CSV File',
    'JSON Data',
  ];

  const handleExport = () => {
    console.log('Exporting report as:', selectedFormat);
    // Add export logic here
  };

  return (
    <div
      className={`rounded-xl p-6 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      } shadow-sm`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <FiDownload className="w-6 h-6 text-white" />
        </div>
        <h3
          className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Export Analytics Report
        </h3>
      </div>

      <div className="space-y-4">
        {/* Export Format Dropdown */}
        <div>
          <label
            className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Export Format
          </label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full px-4 py-3 rounded-lg border text-left flex items-center justify-between transition-all duration-200 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white hover:border-gray-500'
                  : 'bg-white border-gray-300 text-gray-900 hover:border-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            >
              <span>{selectedFormat}</span>
              <FiChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                } ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className={`absolute z-10 w-full mt-2 rounded-lg border shadow-lg overflow-hidden ${
                  isDark
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-200'
                }`}
              >
                {exportFormats.map((format, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedFormat(format);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left transition-colors ${
                      selectedFormat === format
                        ? 'bg-blue-500 text-white'
                        : isDark
                        ? 'text-white hover:bg-gray-600'
                        : 'text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Export Information */}
        <div
          className={`flex gap-3 p-4 rounded-lg ${
            isDark ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'
          }`}
        >
          <FiInfo
            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}
          />
          <div>
            <h4
              className={`font-semibold text-sm mb-1 ${
                isDark ? 'text-blue-300' : 'text-blue-900'
              }`}
            >
              Export Information
            </h4>
            <p
              className={`text-sm ${
                isDark ? 'text-blue-200' : 'text-blue-700'
              }`}
            >
              Your report will include all visible charts, metrics, and data tables based on the
              current time period selection. Large datasets may take a few moments to process.
            </p>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <FiDownload className="w-5 h-5" />
          Export Report
        </button>
      </div>
    </div>
  );
};

export default ExportAnalyticsReport;
