import React, { useEffect, useState } from "react";
import { FaBuilding, FaCheck, FaChevronDown, FaChevronRight, FaEdit, FaIndustry, FaRegCopy, FaSitemap, FaStore, FaTrash } from "react-icons/fa";
import { MdInfo } from "react-icons/md";
import Layout from "../../components/Layout/layout";
import Button from '../../components/ui/Button';

// --- types ---
interface CompanyInfo {
  companyName: string;
  address: string;
  contactNumber: string;
  contactEmail: string;
  registrationNumber: string;
  panOrGst: string;
  lei: string;
  tin: string;
  defaultCurrency: string;
  businessUnits: string;
  reportingCurrency: string;
}
interface BusinessUnitInfo {
  entityName: string;
  parent: string;
  address: string;
  contactNumber: string;
  contactEmail: string;
  uniqueIdentifier: string;
  legalEntityType: string;
  reportingCurrency: string;
  fxAuthority: string;
  fxLimit: number;
  treasuryContact: string;
}
interface EntityData {
  companyInfo: CompanyInfo;
  level2: BusinessUnitInfo[];
  level3: BusinessUnitInfo[];
  level4: BusinessUnitInfo[];
}
interface EntityNode { name: string; children: EntityNode[]; level: number; index: number; }

// --- sample hierarchies (unchanged) ---
const sampleHierarchies: EntityData[] = [
  {
    companyInfo: {
      companyName: "GlobalCorp",
      address: "123 Main St, New York, NY, USA",
      contactNumber: "1234567890",
      contactEmail: "info@globalcorp.com",
      registrationNumber: "REG12345",
      panOrGst: "ABCDE1234F",
      lei: "1234567890ABCDEFGHIJK",
      tin: "123456789",
      defaultCurrency: "USD",
      businessUnits: "North America Division, Europe Division",
      reportingCurrency: "USD"
    },
    level2: [
      {
        entityName: "North America Division",
        parent: "GlobalCorp",
        address: "456 North Ave, Chicago, IL, USA",
        contactNumber: "2345678901",
        contactEmail: "na@globalcorp.com",
        uniqueIdentifier: "NA001",
        legalEntityType: "Public Limited",
        reportingCurrency: "USD",
        fxAuthority: "Allowed",
        fxLimit: 1000000,
        treasuryContact: "John Doe"
      },
      {
        entityName: "Europe Division",
        parent: "GlobalCorp",
        address: "789 Europe St, London, UK",
        contactNumber: "3456789012",
        contactEmail: "europe@globalcorp.com",
        uniqueIdentifier: "EU001",
        legalEntityType: "Public Limited",
        reportingCurrency: "EUR",
        fxAuthority: "Allowed",
        fxLimit: 800000,
        treasuryContact: "Anna Schmidt"
      }
    ],
    level3: [
      {
        entityName: "US Retail",
        parent: "North America Division",
        address: "789 Retail Rd, Dallas, TX, USA",
        contactNumber: "4567890123",
        contactEmail: "usretail@globalcorp.com",
        uniqueIdentifier: "USRT01",
        legalEntityType: "Private Limited",
        reportingCurrency: "USD",
        fxAuthority: "Allowed",
        fxLimit: 500000,
        treasuryContact: "Jane Smith"
      },
      {
        entityName: "Canada Retail",
        parent: "North America Division",
        address: "123 Maple St, Toronto, Canada",
        contactNumber: "5678901234",
        contactEmail: "canada@globalcorp.com",
        uniqueIdentifier: "CART01",
        legalEntityType: "Private Limited",
        reportingCurrency: "CAD",
        fxAuthority: "Allowed",
        fxLimit: 300000,
        treasuryContact: "Pierre Tremblay"
      },
      {
        entityName: "UK Retail",
        parent: "Europe Division",
        address: "456 London Rd, London, UK",
        contactNumber: "6789012345",
        contactEmail: "uk@globalcorp.com",
        uniqueIdentifier: "UKRT01",
        legalEntityType: "Private Limited",
        reportingCurrency: "GBP",
        fxAuthority: "Allowed",
        fxLimit: 400000,
        treasuryContact: "Emily Clark"
      },
      {
        entityName: "Germany Retail",
        parent: "Europe Division",
        address: "789 Berlin Str, Berlin, Germany",
        contactNumber: "7890123456",
        contactEmail: "germany@globalcorp.com",
        uniqueIdentifier: "GER01",
        legalEntityType: "Private Limited",
        reportingCurrency: "EUR",
        fxAuthority: "Allowed",
        fxLimit: 350000,
        treasuryContact: "Hans Müller"
      }
    ],
    level4: [
      {
        entityName: "California Store",
        parent: "US Retail",
        address: "101 CA Plaza, Los Angeles, CA, USA",
        contactNumber: "8901234567",
        contactEmail: "california@globalcorp.com",
        uniqueIdentifier: "CASTR01",
        legalEntityType: "Sole Proprietorship",
        reportingCurrency: "USD",
        fxAuthority: "Limited",
        fxLimit: 100000,
        treasuryContact: "Mike Johnson"
      },
      {
        entityName: "New York Store",
        parent: "US Retail",
        address: "202 NY Ave, New York, NY, USA",
        contactNumber: "9012345678",
        contactEmail: "newyork@globalcorp.com",
        uniqueIdentifier: "NYSTR01",
        legalEntityType: "Sole Proprietorship",
        reportingCurrency: "USD",
        fxAuthority: "Limited",
        fxLimit: 120000,
        treasuryContact: "Sarah Lee"
      },
      {
        entityName: "Ontario Store",
        parent: "Canada Retail",
        address: "303 ON St, Toronto, Canada",
        contactNumber: "1234567809",
        contactEmail: "ontario@globalcorp.com",
        uniqueIdentifier: "ONSTR01",
        legalEntityType: "Sole Proprietorship",
        reportingCurrency: "CAD",
        fxAuthority: "Limited",
        fxLimit: 90000,
        treasuryContact: "Linda Brown"
      },
      {
        entityName: "London Store",
        parent: "UK Retail",
        address: "404 London St, London, UK",
        contactNumber: "2345678901",
        contactEmail: "london@globalcorp.com",
        uniqueIdentifier: "LDSTR01",
        legalEntityType: "Sole Proprietorship",
        reportingCurrency: "GBP",
        fxAuthority: "Limited",
        fxLimit: 95000,
        treasuryContact: "Oliver Smith"
      },
      {
        entityName: "Berlin Store",
        parent: "Germany Retail",
        address: "505 Berlin Str, Berlin, Germany",
        contactNumber: "3456789012",
        contactEmail: "berlin@globalcorp.com",
        uniqueIdentifier: "BRSTR01",
        legalEntityType: "Sole Proprietorship",
        reportingCurrency: "EUR",
        fxAuthority: "Limited",
        fxLimit: 85000,
        treasuryContact: "Klaus Becker"
      }
    ]
  },
];

// --- build a tree from EntityData ---
function buildTree(data: EntityData): EntityNode {
  try {
    const map: Record<string, EntityNode> = {};
    const root: EntityNode = { name: data.companyInfo.companyName, children: [], level: 1, index: 0 };
    map[root.name] = root;
    [...data.level2, ...data.level3, ...data.level4].forEach((item, idx) => {
      const level = data.level2.includes(item as BusinessUnitInfo) ? 2
        : data.level3.includes(item as BusinessUnitInfo) ? 3
        : 4;
      const node: EntityNode = { name: item.entityName, children: [], level, index: idx };
      map[item.entityName] = node;
      map[item.parent]?.children.push(node);
    });
    return root;
  } catch (error) {
    console.error("Error in buildTree:", error);
    return { name: "Error", children: [], level: 1, index: 0 };
  }
}

// --- NodeItem Component (can be split) ---
const NodeItem: React.FC<{
  node: EntityNode;
  onEdit: (n: EntityNode) => void;
  onSelect: (n: EntityNode) => void;
  selected: boolean;
}> = React.memo(({ node, onEdit, onSelect, selected }) => {
  const [open, setOpen] = React.useState(true);
  const bgColors = [
    "bg-blue-100 border-blue-400",
    "bg-green-100 border-green-400",
    "bg-yellow-100 border-yellow-400",
    "bg-purple-100 border-purple-400"
  ];
  const lineColors = [
    "border-l-blue-300",
    "border-l-green-300",
    "border-l-yellow-300",
    "border-l-purple-300"
  ];
  const dotColors = [
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-purple-400"
  ];
  const indent = (node.level - 1) * 24;
  return (
    <div className="mb-4">
      <div
        className={`flex items-center py-1 px-3 rounded-lg shadow-lg hover:shadow-xl cursor-pointer border-2 transition-all duration-200 ${bgColors[node.level - 1]} ${selected ? 'bg-indigo-50 border-indigo-500' : ''}`}
        style={{ marginLeft: indent, position: 'relative' }}
        onClick={() => onSelect(node)}
      >
        {/* Dot for hierarchy connection with neumorphic effect and animated hover */}
        {node.level > 1 
        // && (
          // <span
          //   className={`w-4 h-4 rounded-full mr-2 ${dotColors[node.level - 1]} border-4 border-white shadow-lg transition-all duration-300 hover:scale-110`}
          //   style={{ marginLeft: -22, boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10), 0 1.5px 4px 0 rgba(0,0,0,0.08)' }}
          // >
          //   {/* Horizontal connector line */}
          //   <span
          //     className={`absolute left-0 top-1/2 -translate-y-1/2`}
          //     style={{ width: 18, height: 2, background: 'linear-gradient(90deg, #fff 0%, #e0e7ff 100%)', borderRadius: 2, marginLeft: -18 }}
          //   />
          // </span>
        // )
        }
        <div
          onClick={e => { e.stopPropagation(); setOpen(!open); }}
          className="mr-3 text-gray-500 cursor-pointer"
        >
          {open ? <FaChevronDown /> : <FaChevronRight />}
        </div>
        <span className="flex-1 px-4 py-2 rounded text-gray-800 font-medium">
          {node.name}
        </span>
        <button
          onClick={e => { e.stopPropagation(); onEdit(node); }}
          className="ml-2 text-blue-600 hover:text-blue-800"
        >
          <FaEdit />
        </button>
      </div>
      {open && node.children.length > 0
       && (
        <div className={`pl-6 mt-4 border-l-4 ${lineColors[node.level - 1]} border-dashed`} style={{ marginLeft: indent + 16, minHeight: 40, position: 'relative' }}>
          {/* Animated vertical line gradient */}
          <div className="absolute left-0 top-0 h-full w-1" />
          {node.children.map(child => (
            <NodeItem
              key={`${child.level}-${child.index}`}
              node={child}
              onEdit={onEdit}
              onSelect={onSelect}
              selected={selected && child.name === node.name}
            />
          )
          )}
        </div>
      )}
    </div>
  );
});

// --- Level Icons and Titles (can be split) ---
const levelIcons = [
  <FaBuilding className="text-indigo-400" />,
  <FaSitemap className="text-blue-400" />,
  <FaIndustry className="text-yellow-400" />,
  <FaStore className="text-purple-400" />
];
const levelTitles = [
  'Company Info',
  'Division Info',
  'Business Unit Info',
  'Plant Info'
];

const EntityGraphics: React.FC = () => {
  const [dataList, setDataList] = useState<EntityData[]>([]);
  const [editingRootIdx, setEditingRootIdx] = useState<number | null>(null);
  const [editingNode, setEditingNode] = useState<EntityNode | null>(null);
  const [editValue, setEditValue] = useState("");
  const [selectedRootIdx, setSelectedRootIdx] = useState<number | null>(0); // Default to first entity
  const [selectedNode, setSelectedNode] = useState<{ rootIdx: number; node: EntityNode } | null>(null);
  // Add state for right-panel edit
  const [rightPanelEdit, setRightPanelEdit] = useState(false);
  const [rightPanelEditData, setRightPanelEditData] = useState<any>(null);

  // --- migrate old data to new format ---
  function migrateEntityData(data: any): EntityData | null {
    if (!data) return null;
    // If already in new format, return as is
    if (
      data.companyInfo &&
      Array.isArray(data.level2) &&
      Array.isArray(data.level3) &&
      Array.isArray(data.level4)
    ) {
      return data as EntityData;
    }
    // If only companyName exists (old format), wrap in new structure
    if (typeof data.companyName === 'string') {
      return {
        companyInfo: {
          companyName: data.companyName || '',
          address: data.address || '',
          contactNumber: data.contactNumber || '',
          contactEmail: data.contactEmail || '',
          registrationNumber: data.registrationNumber || '',
          panOrGst: data.panOrGst || '',
          lei: data.lei || '',
          tin: data.tin || '',
          defaultCurrency: data.defaultCurrency || '',
          businessUnits: data.businessUnits || '',
          reportingCurrency: data.reportingCurrency || '',
        },
        level2: [],
        level3: [],
        level4: [],
      };
    }
    // Unknown format, skip
    return null;
  }

  // load + dedupe
  useEffect(() => {
    try {
      const saved = localStorage.getItem("entityData");
      let custom: EntityData[] = [];
      if (saved) {
        const parsed = JSON.parse(saved);
        const migrated = migrateEntityData(parsed);
        if (migrated) custom = [migrated];
      }
      const merged = [...custom, ...sampleHierarchies].filter(
        (item, idx, arr) => arr.findIndex(x => x.companyInfo.companyName === item.companyInfo.companyName) === idx
      );
      setDataList(merged);
    } catch (error) {
      console.error("Error loading entity data:", error);
    }
  }, []);

  // Memoize trees so they only rebuild when dataList changes (move this above useEffect)
  const trees = React.useMemo(() => dataList.map(d => buildTree(d)), [dataList]);

  // --- Set default selectedNode to parent company when company changes ---
  useEffect(() => {
    if (
      selectedRootIdx != null &&
      trees[selectedRootIdx] &&
      dataList[selectedRootIdx]
    ) {
      setSelectedNode({ rootIdx: selectedRootIdx, node: trees[selectedRootIdx] });
    }
  }, [selectedRootIdx, trees, dataList]);

  // open edit modal
  const handleEdit = (rootIdx: number, node: EntityNode) => {
    try {
      setEditingRootIdx(rootIdx);
      setEditingNode(node);
      setEditValue(node.name);
    } catch (error) {
      console.error("Error in handleEdit:", error);
    }
  };

  // save rename
  const saveEdit = () => {
    try {
      if (!editingNode) return;
      const oldName = editingNode.name;
      const newName = editValue.trim();
      if (!newName || newName === oldName) {
        setEditingNode(null);
        setEditingRootIdx(null);
        return;
      }

      const updated = dataList.map((d, idx) => {
        if (idx !== editingRootIdx) return d;

        // level 1
        if (editingNode.level === 1 && d.companyInfo.companyName === oldName) {
          return {
            companyInfo: { ...d.companyInfo, companyName: newName },
            level2: d.level2.map(e => ({ ...e, parent: e.parent === oldName ? newName : e.parent })),
            level3: d.level3.map(e => ({ ...e, parent: e.parent === oldName ? newName : e.parent })),
            level4: d.level4.map(e => ({ ...e, parent: e.parent === oldName ? newName : e.parent })),
          };
        }
        // level 2
        if (editingNode.level === 2) {
          return {
            ...d,
            level2: d.level2.map(e => e.entityName === oldName ? { ...e, entityName: newName } : e),
            level3: d.level3.map(e => ({ ...e, parent: e.parent === oldName ? newName : e.parent })),
            level4: d.level4.map(e => ({ ...e, parent: e.parent === oldName ? newName : e.parent })),
          };
        }
        // level 3
        if (editingNode.level === 3) {
          return {
            ...d,
            level3: d.level3.map(e => e.entityName === oldName ? { ...e, entityName: newName } : e),
            level4: d.level4.map(e => ({ ...e, parent: e.parent === oldName ? newName : e.parent })),
          };
        }
        // level 4
        if (editingNode.level === 4) {
          return {
            ...d,
            level4: d.level4.map(e => e.entityName === oldName ? { ...e, entityName: newName } : e),
          };
        }
        return d;
      });

      setDataList(updated);
      if (editingRootIdx === 0) {
        localStorage.setItem("entityData", JSON.stringify(updated[0]));
      }
      setEditingNode(null);
      setEditingRootIdx(null);
    } catch (error) {
      console.error("Error in saveEdit:", error);
    }
  };

  // delete entire root
  const handleDeleteEntity = (name: string) => {
    try {
      const rest = dataList.filter(d => d.companyInfo.companyName !== name);
      setDataList(rest);
      if (rest.length) localStorage.setItem("entityData", JSON.stringify(rest[0]));
      else localStorage.removeItem("entityData");
    } catch (error) {
      console.error("Error in handleDeleteEntity:", error);
    }
  };

  // delete node + descendants
  const handleDeleteNode = (rootIdx: number, node: EntityNode) => {
    try {
      if (node.level === 1) {
        handleDeleteEntity(node.name);
        return;
      }
      setDataList(curr =>
        curr.map((d, idx) => {
          if (idx !== rootIdx) return d;
          if (node.level === 2) {
            const newL2 = d.level2.filter(e => e.entityName !== node.name);
            const rem2 = node.name;
            const newL3 = d.level3.filter(e => e.parent !== rem2);
            const rem3 = d.level3.filter(e => e.parent === rem2).map(e => e.entityName);
            const newL4 = d.level4.filter(e => !rem3.includes(e.parent));
            return { ...d, level2: newL2, level3: newL3, level4: newL4 };
          }
          if (node.level === 3) {
            const newL3 = d.level3.filter(e => e.entityName !== node.name);
            const rem3 = node.name;
            const newL4 = d.level4.filter(e => e.parent !== rem3);
            return { ...d, level3: newL3, level4: newL4 };
          }
          if (node.level === 4) {
            return { ...d, level4: d.level4.filter(e => e.entityName !== node.name) };
          }
          return d;
        })
      );
      if (rootIdx === 0) {
        localStorage.setItem("entityData", JSON.stringify(dataList[0]));
      }
    } catch (error) {
      console.error("Error in handleDeleteNode:", error);
    }
  };

  // Handler to start editing
  const handleRightPanelEdit = () => {
    if (!selectedNode || !dataList[selectedNode.rootIdx]) return;
    let data: any = null;
    if (selectedNode.node.level === 1) data = { ...dataList[selectedNode.rootIdx].companyInfo };
    if (selectedNode.node.level === 2) data = { ...dataList[selectedNode.rootIdx].level2.find(l2 => l2.entityName === selectedNode.node.name) };
    if (selectedNode.node.level === 3) data = { ...dataList[selectedNode.rootIdx].level3.find(l3 => l3.entityName === selectedNode.node.name) };
    if (selectedNode.node.level === 4) data = { ...dataList[selectedNode.rootIdx].level4.find(l4 => l4.entityName === selectedNode.node.name) };
    setRightPanelEditData(data);
    setRightPanelEdit(true);
  };

  // Handler to save edit
  const handleRightPanelEditSave = () => {
    if (!selectedNode || !rightPanelEditData) return;
    setDataList(prev => prev.map((d, idx) => {
      if (idx !== selectedNode.rootIdx) return d;
      if (selectedNode.node.level === 1) {
        return { ...d, companyInfo: { ...rightPanelEditData } };
      }
      if (selectedNode.node.level === 2) {
        return { ...d, level2: d.level2.map(e => e.entityName === selectedNode.node.name ? { ...rightPanelEditData } : e) };
      }
      if (selectedNode.node.level === 3) {
        return { ...d, level3: d.level3.map(e => e.entityName === selectedNode.node.name ? { ...rightPanelEditData } : e) };
      }
      if (selectedNode.node.level === 4) {
        return { ...d, level4: d.level4.map(e => e.entityName === selectedNode.node.name ? { ...rightPanelEditData } : e) };
      }
      return d;
    }));
    setRightPanelEdit(false);
    setRightPanelEditData(null);
  };

  // Handler to cancel edit
  const handleRightPanelEditCancel = () => {
    setRightPanelEdit(false);
    setRightPanelEditData(null);
  };

  const cancelEdit = () => {
    try {
      setEditingNode(null);
      setEditingRootIdx(null);
    } catch (error) {
      console.error("Error in cancelEdit:", error);
    }
  };

  // Dropdown for company selection
  const companyOptions = dataList.map((d, idx) => ({ label: d.companyInfo.companyName, value: idx }));

  return (
    <Layout title="Entity Hierarchies">
      {/* --- Header Section (can be split) --- */}
      
      <div className="p-6  min-h-screen flex flex-col md:flex-row gap-6">
        {/* --- Tree View Section (can be split) --- */}
        <div className="w-full md:w-[550px] bg-white rounded-xl shadow-lg border border-indigo-200 p-6 h-fit flex flex-col">
          <label className="block text-lg font-semibold text-indigo-700 mb-2">Select Company</label>
          <select
            className="w-full p-3 mb-6 rounded-lg border-2 border-indigo-200 focus:ring-2 focus:ring-indigo-400 bg-indigo-50 text-indigo-800 font-semibold text-lg shadow-sm hover:bg-indigo-100 transition"
            value={selectedRootIdx ?? ''}
            onChange={e => setSelectedRootIdx(Number(e.target.value))}
          >
            {companyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {selectedRootIdx != null && trees[selectedRootIdx] && dataList[selectedRootIdx] && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
                  <FaBuilding className="text-indigo-400" />
                  {dataList[selectedRootIdx].companyInfo.companyName}
                </h2>
                <Button
                  onClick={e => { e.stopPropagation(); handleDeleteEntity(dataList[selectedRootIdx].companyInfo.companyName); }}
                  color="Red"
                  categories="Medium"
                  title="Delete Entity"
                >
                  <FaTrash />
                </Button>
              </div>
              <NodeItem
                node={trees[selectedRootIdx]}
                onEdit={node => handleEdit(selectedRootIdx, node)}
                onSelect={node => setSelectedNode({ rootIdx: selectedRootIdx, node })}
                selected={selectedNode?.rootIdx === selectedRootIdx && selectedNode?.node.name === trees[selectedRootIdx].name}
              />
            </div>
          )}
        </div>
        {/* --- Info Panel Section (can be split) --- */}
        <div className={
          `flex-1 min-w-[350px] rounded-xl shadow-2xl border-2 border-indigo-100 p-8 h-fit ` +
          (selectedNode ?
            selectedNode.node.level === 1 ? 'bg-gradient-to-br from-indigo-50 to-blue-50' :
            selectedNode.node.level === 2 ? 'bg-gradient-to-br from-green-50 to-green-100' :
            selectedNode.node.level === 3 ? 'bg-gradient-to-br from-yellow-50 to-green-50' :
            selectedNode.node.level === 4 ? 'bg-gradient-to-br from-purple-50 to-purple-100' :
            'bg-gradient-to-br from-yellow-50 to-purple-50'
          : 'bg-gradient-to-br from-yellow-50 to-purple-50')
        }>
          {selectedNode && dataList[selectedNode.rootIdx] ? (
            <>
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-300 shadow text-3xl">
                  {levelIcons[selectedNode.node.level - 1]}
                </span>
                <div>
                  <h2 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-2">
                    {selectedNode.node.name}
                  </h2>
                  <div className="text-lg font-semibold text-indigo-400">{levelTitles[selectedNode.node.level - 1]}</div>
                </div>
                <Button
                  className="ml-auto px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 border border-indigo-300 text-base font-semibold flex items-center gap-2 shadow"
                  onClick={handleRightPanelEdit}
                  color="Blue"
                  categories="Medium"
                >
                  <FaEdit className="inline-block" /> Edit
                </Button>
              </div>
              {/* Edit Form or Details */}
              {rightPanelEdit ? (
                <form
                  onSubmit={e => { e.preventDefault(); handleRightPanelEditSave(); }}
                  className="space-y-4"
                >
                  {rightPanelEditData && Object.entries(rightPanelEditData).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <label className="font-medium text-gray-700 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <input
                        className="p-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-indigo-900 font-semibold shadow"
                        value={typeof value === 'string' || typeof value === 'number' ? value : ''}
                        onChange={e => setRightPanelEditData((prev: any) => ({ ...prev, [key]: e.target.value }))}
                        disabled={key === 'entityName' || key === 'companyName'}
                      />
                    </div>
                  ))}
                  <div className="flex gap-3 mt-4">
                    <Button type="button" onClick={handleRightPanelEditCancel} color="Blue" categories="Medium">Cancel</Button>
                    <Button type="submit" color="Green" categories="Medium">Save</Button>
                  </div>
                </form>
              ) : (
                <div className="bg-white rounded-xl shadow p-6 border-2 border-indigo-50 animate-fade-in">
                  {/* Show info for selected node, with color and fields by level */}
                  {selectedNode.node.level === 1 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-4 text-indigo-700 flex items-center gap-2"><MdInfo className="text-indigo-400" /> Company Info</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(dataList[selectedNode.rootIdx].companyInfo).map(([key, value]) => (
                          <InfoField key={key} label={key} value={value} color="text-indigo-500" />
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedNode.node.level === 2 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-4 text-blue-700 flex items-center gap-2"><MdInfo className="text-blue-400" /> Division Info</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(dataList[selectedNode.rootIdx].level2.find(l2 => l2.entityName === selectedNode.node.name) || {}).map(([key, value]) => (
                          <InfoField key={key} label={key} value={value} color="text-blue-500" />
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedNode.node.level === 3 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-4 text-yellow-700 flex items-center gap-2"><MdInfo className="text-yellow-400" /> Business Unit Info</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(dataList[selectedNode.rootIdx].level3.find(l3 => l3.entityName === selectedNode.node.name) || {}).map(([key, value]) => (
                          <InfoField key={key} label={key} value={value} color="text-yellow-500" />
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedNode.node.level === 4 && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-4 text-purple-700 flex items-center gap-2"><MdInfo className="text-purple-400" /> Plant Info</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(dataList[selectedNode.rootIdx].level4.find(l4 => l4.entityName === selectedNode.node.name) || {}).map(([key, value]) => (
                          <InfoField key={key} label={key} value={value} color="text-purple-500" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-400 text-center mt-10 text-xl font-semibold">Select a node to view details.</div>
          )}
        </div>
        {/* --- Edit Modal Section (can be split) --- */}
        {editingNode && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white w-96 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Edit {editingNode.name}
              </h2>
              <input
                className="w-full p-2 border rounded mb-4"
                value={editValue}
                onChange={e => {
                  try {
                    setEditValue(e.target.value);
                  } catch (error) {
                    console.error("Error updating edit value:", error);
                  }
                }}
              />
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => {
                    try {
                      if (editingRootIdx != null) {
                        handleDeleteNode(editingRootIdx, editingNode);
                      }
                      cancelEdit();
                    } catch (error) {
                      console.error("Error deleting node:", error);
                    }
                  }}
                  color="Red"
                  categories="Medium"
                >
                  Delete
                </Button>
                <div className="space-x-3">
                  <Button
                    onClick={() => {
                      try {
                        cancelEdit();
                      } catch (error) {
                        console.error("Error cancelling edit:", error);
                      }
                    }}
                    color="Blue"
                    categories="Medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      try {
                        saveEdit();
                      } catch (error) {
                        console.error("Error saving edit:", error);
                      }
                    }}
                    color="Green"
                    categories="Medium"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

// --- InfoField: Interactive, copyable, color-coded field display ---
const InfoField: React.FC<{
  label: string;
  value: string | number;
  color: string;
}> = ({ label, value, color }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="flex items-center gap-2 group px-0 py-1">
      <span className={`font-semibold max-w-[190px] capitalize text-base ${color}`}>{label.replace(/([A-Z])/g, ' $1')}:</span>
      <span className="text-indigo-900 font-medium  max-w-[400px] select-all" title={String(value)}>{value}</span>
      <button
        type="button"
        className="ml-1 text-indigo-400 hover:text-indigo-700 focus:outline-none transition"
        onClick={handleCopy}
        tabIndex={-1}
      >
        {copied ? <FaCheck className="inline-block text-green-500 animate-bounce" /> : <FaRegCopy className="inline-block" />}
      </button>
    </div>
  );
};

// --- Export (can be split) ---
export default EntityGraphics;
