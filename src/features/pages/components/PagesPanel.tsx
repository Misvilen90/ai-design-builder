import { useState } from "react";
import { useBuilderStore } from "../../../store/useBuilderStore";

const PagesPanel = () => {
  const {
    pages,
    activePageId,
    addPage,
    deletePage,
    renamePage,
    setActivePageId,
  } = useBuilderStore();

  const [newPageName, setNewPageName] = useState("");

  return (
    <div style={{ padding: "10px", width: "250px", borderRight: "1px solid #ddd" }}>
      <h3>Pages</h3>

      {/* Pages List */}
      <div>
        {pages.map((page) => (
          <div
            key={page.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "5px",
              background: page.id === activePageId ? "#e0e0e0" : "transparent",
              cursor: "pointer",
              alignItems: "center",
            }}
            onClick={() => setActivePageId(page.id)}   // ✅ FIXED HERE
          >
            <input
              value={page.name}
                aria-label="Page name"

              onChange={(e) => renamePage(page.id, e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                width: "150px",
              }}
              onClick={(e) => e.stopPropagation()} // prevent page switch when typing
            />

            <button
              onClick={(e) => {
                e.stopPropagation();
                deletePage(page.id);
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* Add Page */}
      <div style={{ marginTop: "10px" }}>
        <input
          value={newPageName}
          placeholder="New page"
          onChange={(e) => setNewPageName(e.target.value)}
        />
        <button
          onClick={() => {
            if (newPageName.trim()) {
              addPage(newPageName);
              setNewPageName("");
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default PagesPanel;