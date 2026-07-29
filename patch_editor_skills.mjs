import fs from 'fs';

let code = fs.readFileSync('src/components/ResumeEditor.tsx', 'utf-8');

const oldSkills = `          {/* Skills */}
          <section className="space-y-4">
             <h3 className="text-base font-semibold border-b border-neutral-200 pb-2">Skills</h3>
             <textarea 
               value={data.skills.join(', ')}
               onChange={e => onChange(prev => ({ ...prev, skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
               className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all text-sm min-h-[80px]"
               placeholder="React, TypeScript, Node.js (comma separated)"
             />
          </section>`;

const newSkills = `          {/* Skills */}
          <section className="space-y-4">
             <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <h3 className="text-base font-semibold">Skills</h3>
                <button 
                  onClick={() => onChange(prev => ({
                    ...prev, 
                    skills: [...(prev.skills || []), { id: crypto.randomUUID(), name: '', level: 'Intermediate' }]
                  }))}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
                >
                  <Plus size={14} /> Add Skill
                </button>
             </div>
             
             <AnimatePresence>
                {(data.skills || []).map((skill, index) => (
                  <motion.div 
                    key={skill.id || index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3"
                  >
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          value={skill.name} 
                          onChange={e => {
                            const newSkills = [...data.skills];
                            newSkills[index].name = e.target.value;
                            onChange(prev => ({ ...prev, skills: newSkills }));
                          }}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm"
                          placeholder="e.g. React"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <select
                          value={skill.level}
                          onChange={e => {
                            const newSkills = [...data.skills];
                            newSkills[index].level = e.target.value;
                            onChange(prev => ({ ...prev, skills: newSkills }));
                          }}
                          className="w-full appearance-none px-3 py-2 bg-white border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all text-sm cursor-pointer"
                        >
                          <option value="Expert">Expert</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Familiar">Familiar</option>
                          <option value="Beginner">Beginner</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </div>
                      <button 
                        onClick={() => onChange(prev => ({
                          ...prev,
                          skills: prev.skills.filter((_, i) => i !== index)
                        }))}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
             </AnimatePresence>
          </section>`;

code = code.replace(oldSkills, newSkills);
fs.writeFileSync('src/components/ResumeEditor.tsx', code);
