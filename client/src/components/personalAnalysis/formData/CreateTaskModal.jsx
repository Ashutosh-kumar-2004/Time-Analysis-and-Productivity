import React from 'react';
import { X, Calendar, Clock, List, Tag } from 'lucide-react';

const CreateTaskModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20 dark:border-white/10 p-8 transform transition-all animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header icon */}
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full text-blue-600 dark:text-blue-400">
                        <List className="w-8 h-8" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">Create New Task</h2>
                <div className="text-center mb-8">
                     <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Task Title *</label>
                     <input 
                        type="text" 
                        className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., Complete Calculus Assignment"
                     />
                </div>

                <div className="space-y-6">
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea 
                            rows="3"
                            className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="What needs to be done?"
                        ></textarea>
                    </div>

                    {/* Category & Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                            <select className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer">
                                <option>Academic Studies</option>
                                <option>Project Development</option>
                                <option>Personal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority *</label>
                            <select className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>
                        </div>
                    </div>

                    {/* Time & Deadline */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estimated Time (minutes)</label>
                            <input 
                                type="number" 
                                defaultValue="60"
                                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deadline</label>
                            <div className="relative">
                                <input 
                                    type="datetime-local" 
                                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                                <Calendar className="absolute right-4 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                placeholder="Add a tag"
                                className="flex-1 bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg font-medium transition-colors cursor-pointer">
                                Add
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-white/10">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer">
                        Create Task
                    </button>
                    <button 
                        onClick={onClose}
                        className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold transition-all cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
