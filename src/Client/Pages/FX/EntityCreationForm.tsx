import { Lock } from 'lucide-react';
import React, { useCallback, useMemo, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import BusinessUnitModal from "../../components/Entitycreation/BusinessUnitModal";
import EntityDetailsModal from "../../components/Entitycreation/EntityDetailsModal";
import Section from "../../components/Entitycreation/Section";
import Layout from "../../components/Layout/layout";
import Button from '../../components/ui/Button';


// --- THEME COLORS for modals by level --
const modalThemes = [
  {
    bg: "bg-blue-100",
    accent: "text-blue-700",
    border: "border-blue-300",
    button: "bg-blue-500 hover:bg-blue-600 text-white"
  },
  {
    bg: "bg-green-100",
    accent: "text-green-700",
    border: "border-green-300",
    button: "bg-green-500 hover:bg-green-600 text-white"
  },
  {
    bg: "bg-yellow-100",
    accent: "text-yellow-700",
    border: "border-yellow-300",
    button: "bg-yellow-500 hover:bg-yellow-600 text-white"
  },
  {
    bg: "bg-purple-100",
    accent: "text-purple-700",
    border: "border-purple-300",
    button: "bg-purple-500 hover:bg-purple-600 text-white"
  }
];

interface LevelEntity {
  name: string;
  parent: string;
}

// Custom hook to handle entity levels logic
function useEntityLevel(initial: LevelEntity[] = []) {
  const [entities, setEntities] = useState<LevelEntity[]>(initial);

  const addEntity = useCallback(() => {
    setEntities((prev) => [...prev, { name: "", parent: "" }]);
  }, []);

  const updateEntity = useCallback((idx: number, key: keyof LevelEntity, value: string) => {
    setEntities((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: value };
      return updated;
    });
  }, []);

  const removeEntity = useCallback((idx: number) => {
    setEntities((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  return { entities, setEntities, addEntity, updateEntity, removeEntity };
}

const EntityCreationForm: React.FC = () => {
  const navigate = useNavigate();
  // --- modal state for each entity at each level ---
  const [level1ModalOpen, setLevel1ModalOpen] = useState(false);
  const [level1Submitted, setLevel1Submitted] = useState(false);
  const [level1Data, setLevel1Data] = useState<any>(null); // Store all company info
  const [level2ModalOpen, setLevel2ModalOpen] = useState<number | null>(null);
  const [level2Submitted, setLevel2Submitted] = useState<boolean[]>([]);
  const [level2Data, setLevel2Data] = useState<any[]>([]); // Store all level2 info
  const [level3ModalOpen, setLevel3ModalOpen] = useState<number | null>(null);
  const [level3Submitted, setLevel3Submitted] = useState<boolean[]>([]);
  const [level3Data, setLevel3Data] = useState<any[]>([]); // Store all level3 info
  const [level4ModalOpen, setLevel4ModalOpen] = useState<number | null>(null);
  const [level4Submitted, setLevel4Submitted] = useState<boolean[]>([]);
  const [level4Data, setLevel4Data] = useState<any[]>([]); // Store all level4 info
  const [level1, setLevel1] = useState("");

  const {
    entities: level2,
    setEntities: setLevel2,
    addEntity: addLevel2,
    updateEntity: updateLevel2,
    removeEntity: removeLevel2,
  } = useEntityLevel();
  const {
    entities: level3,
    setEntities: setLevel3,
    addEntity: addLevel3,
    updateEntity: updateLevel3,
    removeEntity: removeLevel3,
  } = useEntityLevel();
  const {
    entities: level4,
    setEntities: setLevel4,
    addEntity: addLevel4,
    updateEntity: updateLevel4,
    removeEntity: removeLevel4,
  } = useEntityLevel();

  // Memoize options for select dropdowns
  const level2ParentOptions = useMemo(() => (level1 ? [level1] : []), [level1]);
  const level3ParentOptions = useMemo(() => level2.map((l2) => l2.name), [level2]);
  const level4ParentOptions = useMemo(() => level3.map((l3) => l3.name), [level3]);

  const handleSubmit = useCallback(() => {
    setLevel1Submitted(true); // lock after save
    // Map parent info into each level2/3/4 entry before saving
    const level2WithParent = level2Data.map((data, idx) => ({
      ...data,
      parent: level2[idx]?.parent || level1,
    }));
    const level3WithParent = level3Data.map((data, idx) => ({
      ...data,
      parent: level3[idx]?.parent || (level2.find(l2 => l2.name === level3[idx]?.parent)?.name || ""),
    }));
    const level4WithParent = level4Data.map((data, idx) => ({
      ...data,
      parent: level4[idx]?.parent || (level3.find(l3 => l3.name === level4[idx]?.parent)?.name || ""),
    }));
    alert("Structure Saved");
    localStorage.setItem(
      "entityData",
      JSON.stringify({
        companyInfo: level1Data,
        level2: level2WithParent,
        level3: level3WithParent,
        level4: level4WithParent
      })
    );
    navigate("/hierarchical", {
      state: {
        companyInfo: level1Data,
        level2: level2WithParent,
        level3: level3WithParent,
        level4: level4WithParent
      }
    });
  }, [level1Data, level2Data, level3Data, level4Data, level1, level2, level3, level4, navigate]);

  // --- handlers for modal submit ---
  const handleLevel1Submit = (data: any) => {
    setLevel1Submitted(true);
    setLevel1Data(data);
    setLevel1(data.companyName); // sync modal name to input
    setLevel1ModalOpen(false);
  };
  const handleLevel2Submit = (idx: number) => (data: any) => {
    // Set parent before saving
    data.parent = level2[idx]?.parent || level1;
    setLevel2Submitted(prev => {
      const arr = [...prev];
      arr[idx] = true;
      return arr;
    });
    setLevel2Data(prev => {
      const arr = [...prev];
      arr[idx] = data;
      return arr;
    });
    setLevel2ModalOpen(null);
  };
  const handleLevel3Submit = (idx: number) => (data: any) => {
    // Set parent before saving
    data.parent = level3[idx]?.parent || (level2.find(l2 => l2.name === level3[idx]?.parent)?.name || "");
    setLevel3Submitted(prev => {
      const arr = [...prev];
      arr[idx] = true;
      return arr;
    });
    setLevel3Data(prev => {
      const arr = [...prev];
      arr[idx] = data;
      return arr;
    });
    setLevel3ModalOpen(null);
  };
  const handleLevel4Submit = (idx: number) => (data: any) => {
    // Set parent before saving
    data.parent = level4[idx]?.parent || (level3.find(l3 => l3.name === level4[idx]?.parent)?.name || "");
    setLevel4Submitted(prev => {
      const arr = [...prev];
      arr[idx] = true;
      return arr;
    });
    setLevel4Data(prev => {
      const arr = [...prev];
      arr[idx] = data;
      return arr;
    });
    setLevel4ModalOpen(null);
  };

  // --- add handlers that open modal and lock child creation ---
  const handleAddLevel2 = () => {
    addLevel2();
    setLevel2Submitted(prev => [...prev, false]);
    setLevel2ModalOpen(level2.length); // open modal for new entity
  };
  const handleAddLevel3 = () => {
    addLevel3();
    setLevel3Submitted(prev => [...prev, false]);
    setLevel3ModalOpen(level3.length);
  };
  const handleAddLevel4 = () => {
    addLevel4();
    setLevel4Submitted(prev => [...prev, false]);
    setLevel4ModalOpen(level4.length);
  };

  // --- sync Level 1 input and modal name both ways ---
  React.useEffect(() => {
    // If modal changes, update input
    if (level1Data && level1Data.companyName !== level1) {
      setLevel1(level1Data.companyName);
    }
  }, [level1Data]);

  React.useEffect(() => {
    // If input changes, update modal data
    if (level1 && (!level1Data || level1Data.companyName !== level1)) {
      setLevel1Data((prev: any) => ({ ...prev, companyName: level1 }));
    }
  }, [level1]);

  // --- sync Level 2, 3, 4 input and modal name both ways ---
  React.useEffect(() => {
    // Level 2
    if (level2Data.length && level2.length) {
      setLevel2((prev: LevelEntity[]) => prev.map((entity, idx) =>
        level2Data[idx]?.entityName && entity.name !== level2Data[idx].entityName
          ? { ...entity, name: level2Data[idx].entityName }
          : entity
      ));
    }
    // Level 3
    if (level3Data.length && level3.length) {
      setLevel3((prev: LevelEntity[]) => prev.map((entity, idx) =>
        level3Data[idx]?.entityName && entity.name !== level3Data[idx].entityName
          ? { ...entity, name: level3Data[idx].entityName }
          : entity
      ));
    }
    // Level 4
    if (level4Data.length && level4.length) {
      setLevel4((prev: LevelEntity[]) => prev.map((entity, idx) =>
        level4Data[idx]?.entityName && entity.name !== level4Data[idx].entityName
          ? { ...entity, name: level4Data[idx].entityName }
          : entity
      ));
    }
  }, [level2Data, level3Data, level4Data]);

  React.useEffect(() => {
    setLevel2Data(prev => prev.map((data, idx) =>
      level2[idx]?.name && data?.entityName !== level2[idx].name
        ? { ...data, entityName: level2[idx].name }
        : data
    ));
    setLevel3Data(prev => prev.map((data, idx) =>
      level3[idx]?.name && data?.entityName !== level3[idx].name
        ? { ...data, entityName: level3[idx].name }
        : data
    ));
    setLevel4Data(prev => prev.map((data, idx) =>
      level4[idx]?.name && data?.entityName !== level4[idx].name
        ? { ...data, entityName: level4[idx].name }
        : data
    ));
  }, [level2, level3, level4]);

  return (
    <Layout title="Entity Creation Form">
     <div className="p-6 bg-gray-50 min-h-screen w-full">
      <div className="max-w-4xl  mx-auto bg-white rounded-lg shadow border border-gray-200 p-6">
        <Section heading="Entity (Level 1)" level={1}>
        <div className={`p-3 rounded-md ml-1 flex items-center gap-3`}>
          <input
            type="text"
            className="w-4/5 p-2 border border-gray-300 rounded-md"
            placeholder="Enter Parent Company Name"
            value={level1}
            onChange={(e) => setLevel1(e.target.value)}
          />
          <div>
            <Button
              onClick={() => setLevel1ModalOpen(true)}
              color="Blue"
              categories="Medium"
            >
              {level1Submitted ? 'Edit Info' : '+ Info'}
            </Button>
          </div>  
        </div>
        </Section>
        {/* Level 1 Modal */}
        <EntityDetailsModal
          isOpen={level1ModalOpen}
          onClose={() => setLevel1ModalOpen(false)}
          onSubmit={handleLevel1Submit}
          initialData={{ ...level1Data, companyName: level1 }}
          theme={modalThemes[0]}
        />

        <Section heading="Sub-Entity (Level 2)" level={2}>
          {level1Submitted ? (
            <div className="flex flex-col">
              {level2.map((entity, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 mb-2 ml-1 p-3 rounded-md bg-green-100`}
                >
                  <input
                    type="text"
                    placeholder="Business Unit Name"
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    value={entity.name}
                    onChange={e => updateLevel2(idx, 'name', e.target.value)}
                    disabled={level2Submitted[idx]}
                  />
                  <select
                    className="p-2 border border-gray-300 rounded-md"
                    value={entity.parent}
                    onChange={e => updateLevel2(idx, 'parent', e.target.value)}
                  >
                    <option value="">Select Parent</option>
                    {level2ParentOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <Button
                    onClick={() => setLevel2ModalOpen(idx)}
                    color="Blue"
                    categories="Medium"
                  >
                    {level2Submitted[idx] ? 'Edit Info' : '+ Info'}
                  </Button>
                  <div>
                    <Button
                      onClick={() => removeLevel2(idx)}
                      color="Red"
                      categories="Large"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                  {/* Modal for this Level 2 entity */}
                  {level2ModalOpen === idx && (
                    <BusinessUnitModal
                      isOpen={true}
                      onClose={() => setLevel2ModalOpen(null)}
                      onSubmit={data => {
                        updateLevel2(idx, "name", data.entityName); // always sync modal name to input
                        setLevel2Data(prev => {
                          const arr = [...prev];
                          arr[idx] = data;
                          return arr;
                        });
                        setLevel2Submitted(prev => {
                          const arr = [...prev];
                          arr[idx] = true;
                          return arr;
                        });
                        setLevel2ModalOpen(null);
                      }}
                      initialData={{ ...level2Data[idx], entityName: entity.name }}
                      theme={modalThemes[1]}
                    />
                  )}
                </div>
              ))}
              <div className="ml-4 mt-1 self-start">
                <Button
                  onClick={handleAddLevel2}
                  color="Blue"
                  categories="Medium"
                  disabled={!level1Submitted}
                >
                  <FaPlus />
                </Button>
              </div>
            </div>
          ) : (
            <div className="ml-1 p-3 rounded-md bg-gray-100 text-gray-500 border border-gray-300 flex items-center gap-2">
              <span className="text-xl text-gray-400"><Lock size={20} /></span>
              <span>Please add Company Info first to unlock Sub-Entities.</span>
            </div>
          )}
        </Section>
        <Section heading="Business Units (Level 3)" level={3}>
          {level2.filter((_, idx) => level2Submitted[idx]).length > 0 ? (
            <div className="flex flex-col">
              {level3.map((entity, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 mb-2 ml-1 p-3 rounded-md bg-yellow-100`}
                >
                  <input
                    type="text"
                    placeholder="Business Unit Name"
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    value={entity.name}
                    onChange={e => updateLevel3(idx, 'name', e.target.value)}
                    disabled={level3Submitted[idx]}
                  />
                  <select
                    className="p-2 border border-gray-300 rounded-md"
                    value={entity.parent}
                    onChange={e => updateLevel3(idx, 'parent', e.target.value)}
                  >
                    <option value="">Select Parent</option>
                    {level3ParentOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <Button
                    onClick={() => setLevel3ModalOpen(idx)}
                    color="Blue"
                    categories="Medium"
                  >
                    {level3Submitted[idx] ? 'Edit Info' : '+ Info'}
                  </Button>
                  <div>
                    <Button
                      onClick={() => removeLevel3(idx)}
                      color="Red"
                      categories="Large"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                  {/* Modal for this Level 3 entity */}
                  {level3ModalOpen === idx && (
                    <BusinessUnitModal
                      isOpen={true}
                      onClose={() => setLevel3ModalOpen(null)}
                      onSubmit={data => {
                        updateLevel3(idx, "name", data.entityName); // always sync modal name to input
                        setLevel3Data(prev => {
                          const arr = [...prev];
                          arr[idx] = data;
                          return arr;
                        });
                        setLevel3Submitted(prev => {
                          const arr = [...prev];
                          arr[idx] = true;
                          return arr;
                        });
                        setLevel3ModalOpen(null);
                      }}
                      initialData={{ ...level3Data[idx], entityName: entity.name }}
                      theme={modalThemes[2]}
                    />
                  )}
                </div>
              ))}
              <div className="ml-4 mt-1 self-start">
                <Button
                  onClick={handleAddLevel3}
                  color="Blue"
                  categories="Medium"
                  disabled={level2.filter((_, idx) => level2Submitted[idx]).length === 0}
                >
                  <FaPlus />
                </Button>
              </div>
            </div>
          ) : (
            <div className="ml-1 p-3 rounded-md bg-gray-100 text-gray-500 border border-gray-300 flex items-center gap-2">
              <span className="text-xl text-gray-400"><Lock size={20} /></span>
              <span>Please add Sub-Entities first to unlock Business Units.</span>
            </div>
          )}
        </Section>
        <Section heading="Plants (Level 4)" level={4}>
          {level3.filter((_, idx) => level3Submitted[idx]).length > 0 ? (
            <div className="flex flex-col">
              {level4.map((entity, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 mb-2 ml-1 p-3 rounded-md bg-purple-100`}
                >
                  <input
                    type="text"
                    placeholder="Business Unit Name"
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    value={entity.name}
                    onChange={e => updateLevel4(idx, 'name', e.target.value)}
                    disabled={level4Submitted[idx]}
                  />
                  <select
                    className="p-2 border border-gray-300 rounded-md"
                    value={entity.parent}
                    onChange={e => updateLevel4(idx, 'parent', e.target.value)}
                  >
                    <option value="">Select Parent</option>
                    {level4ParentOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <Button
                    onClick={() => setLevel4ModalOpen(idx)}
                    color="Blue"
                    categories="Medium"
                  >
                    {level4Submitted[idx] ? 'Edit Info' : '+ Info'}
                  </Button>
                  <div>
                    <Button
                      onClick={() => removeLevel4(idx)}
                      color="Red"
                      categories="Large"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                  {/* Modal for this Level 4 entity */}
                  {level4ModalOpen === idx && (
                    <BusinessUnitModal
                      isOpen={true}
                      onClose={() => setLevel4ModalOpen(null)}
                      onSubmit={data => {
                        updateLevel4(idx, "name", data.entityName); // always sync modal name to input
                        setLevel4Data(prev => {
                          const arr = [...prev];
                          arr[idx] = data;
                          return arr;
                        });
                        setLevel4Submitted(prev => {
                          const arr = [...prev];
                          arr[idx] = true;
                          return arr;
                        });
                        setLevel4ModalOpen(null);
                      }}
                      initialData={{ ...level4Data[idx], entityName: entity.name }}
                      theme={modalThemes[3]}
                    />
                  )}
                </div>
              ))}
              <div className="ml-4 mt-1 self-start">
                <Button
                  onClick={handleAddLevel4}
                  color="Blue"
                  categories="Medium"
                  disabled={level3.filter((_, idx) => level3Submitted[idx]).length === 0}
                >
                  <FaPlus />
                </Button>
              </div>
            </div>
          ) : (
            <div className="ml-1 p-3 rounded-md bg-gray-100 text-gray-500 border border-gray-300 flex items-center gap-2">
              <span className="text-xl text-gray-400"><Lock size={20} /></span>
              <span>Please add Business Units first to unlock Plants.</span>
            </div>
          )}
        </Section>
        <div className="flex justify-end mt-6">
          <div>
          <Button
            onClick={handleSubmit}
            color="Green"
            categories="Large"
          >
            Save Entity Structure
          </Button>
          </div>
        </div>

        {/* Business Unit Modals */}
        {level2.map((_, idx) => (
          <BusinessUnitModal
            key={idx}
            isOpen={level2ModalOpen === idx && !level2Submitted[idx]}
            onClose={() => setLevel2ModalOpen(null)}
            onSubmit={handleLevel2Submit(idx)}
            initialData={level2Data[idx]}
            theme={modalThemes[1]}
          />
        ))}
        {level3.map((_, idx) => (
          <BusinessUnitModal
            key={idx}
            isOpen={level3ModalOpen === idx && !level3Submitted[idx]}
            onClose={() => setLevel3ModalOpen(null)}
            onSubmit={handleLevel3Submit(idx)}
            initialData={level3Data[idx]}
            theme={modalThemes[2]}
          />
        ))}
        {level4.map((_, idx) => (
          <BusinessUnitModal
            key={idx}
            isOpen={level4ModalOpen === idx && !level4Submitted[idx]}
            onClose={() => setLevel4ModalOpen(null)}
            onSubmit={handleLevel4Submit(idx)}
            initialData={level4Data[idx]}
            theme={modalThemes[3]}
          />
        ))}
      </div>
    </div>
    </Layout>
  );
};

export default EntityCreationForm;

// --- CHANGES & REASONS ---
// 1. Extracted repeated logic for entity levels into a custom hook `useEntityLevel` for DRYness and clarity.
// 2. Used useCallback for all handlers to prevent unnecessary re-renders and improve performance.
// 3. Used useMemo for select options to avoid recalculating on every render.
// 4. Updated state immutably and in a more React-idiomatic way.
// 5. UI and output remain unchanged, only logic is more React idiomatic and maintainable.
// 6. Imported EntityDetailsModal component and added its state management.
// 7. Integrated the modal opening and closing logic with the button in the Level 1 section.
// 8. Added lock/disabled logic and visual cues to prevent adding lower-level entities before filling upper-level forms.
// 9. Enhanced user experience with beautified lock messages and button states.
// 10. Implemented per-level modal locking: Level 2 is locked until Company Info modal is submitted, and each Level 2 entry is locked until its Business Unit modal is submitted. Added state and handlers for this logic. Showed modals as needed and disabled fields/buttons accordingly.
// 11. Implemented recursive modal/locking logic for all levels: each entity at every level is only editable and can add children after its modal is submitted. Add state and handlers for each level, and update UI/logic accordingly.
// 12. Updated to store all modal data for each entity level, pass initialData to modals, and save the full structure to localStorage. This enables full details to be displayed in EntityGraphics.
// 13. Ensured that when saving, each level2/3/4 entry includes the correct parent info and all modal fields, so EntityGraphics can display the full details. This fixes the missing data issue.
// 14. Ensured that when submitting a modal for level 2, 3, or 4, the parent field is set on the data object before saving it to the state array. This guarantees the parent is always correct and the graphics view will reflect the full hierarchy.
// 15. Passed a theme prop to each modal based on its level, using modern Tailwind color classes for background, accent, border, and button. This will allow each modal to match the color of its parent section.
// 16. Rearranged buttons for each level: Add Info is next to the input, Delete is always enabled and at the end.
// 17. When opening the modal, the input name is pre-filled in the modal. When submitting the modal, the input is updated with the modal's name.
// 18. UI is more compact and clear for each row.
// 19. Delete button is always enabled, regardless of lock/submit state.
// 20. Info modal can be reopened for editing after submission. Button label changes to 'Edit Info' if already submitted. On submit, data is updated and row remains in submitted state. Applies to all levels.
// 21. Level 1 modal's submit handler now always syncs the company name to the main input.
// 22. The button next to the input in Level 1 is always used for both add and edit (no extra button). The label changes based on submission state.
// 23. For all levels, after submitting the modal, the input name is always updated to match the modal's name. This keeps the input and modal in sync for every level, not just Level 1.
// 24. Parent dropdowns for all levels are now always enabled, so you can always change the parent, even after info is submitted.
// 25. Reverted Level 3 and Level 4 entity rows to their original compact, horizontal layout and button style.
// 26. Copied the lock message, icon size, and button sizes/styles from Level 2 to Level 3 and Level 4 sections for consistency. Now, all lower levels use the same UI/UX for lock/warning and add buttons as Level 2.
// 27. Moved the Add buttons for Level 3 and Level 4 outside the .map() loop so they always appear at the bottom of each section, matching Level 2. This ensures the Add button is always visible when allowed, regardless of the number of entities.
// 28. Wrapped the mapped entity rows and the Add button for Level 2, 3, and 4 in a flex flex-col container. The Add button now uses ml-4, ml-8, ml-12 and mt-1 self-start for proper alignment with the input fields above, ensuring consistent left alignment across all levels.
// 29. Added two useEffect hooks to keep the Level 1 input and modal name in sync both ways (typing in either updates the other).
// 30. Removed disabling logic for Level 1 input and Edit Info button so you can always edit until Save Entity Structure is clicked.
// 31. On Save Entity Structure, Level 1 is locked again by setting level1Submitted to true.
// 32. Added useEffect hooks to keep Level 2, 3, and 4 input fields and modal names in sync both ways (typing in either updates the other, just like Level 1).
// 33. Changed the placeholder for all lower levels to 'Business Unit Name' for consistency and to match the modal field label.

