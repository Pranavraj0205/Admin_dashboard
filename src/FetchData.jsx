import React, { useState, useEffect } from "react";

function MemberList({ members }) {
  const pageSize = 10;
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editedMember, setEditedMember] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setFilteredMembers(members);
    updateTotalPages(members);
  }, [members]);

  const updateTotalPages = (data) => {
    const total = Math.ceil(data.length / pageSize);
    setTotalPages(total);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    const filtered = members.filter(
      (member) =>
        member.id.toLowerCase().includes(query) ||
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query)
    );
    setFilteredMembers(filtered);
    setCurrentPage(1);
    updateTotalPages(filtered);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOneDelete = (id) => {
    const updatedMembers = filteredMembers.filter((member) => member.id !== id);
    setFilteredMembers(updatedMembers);
    setCurrentPage(1);
    updateTotalPages(updatedMembers);
  };
  const handleDelete = () => {
    const updatedMembers = filteredMembers.filter(
      (member) => !selectedRows.includes(member.id)
    );
    setFilteredMembers(updatedMembers);
    setSelectedRows([]);
    setCurrentPage(1);
    updateTotalPages(updatedMembers);
  };

  const handleEdit = (id) => {
    const memberToEdit = filteredMembers.find((member) => member.id === id);
    setEditingId(id);
    setEditedMember({ ...memberToEdit });
  };

  const handleSave = (id) => {
    setEditingId(null);
    const updatedMembers = filteredMembers.map((member) => {
      if (member.id === id) {
        return { ...member, ...editedMember };
      }
      return member;
    });
    setFilteredMembers(updatedMembers);
    setEditedMember({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedMember({});
  };

  const handleCheckboxChange = (event, id) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      const currentPageMembers = filteredMembers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      );
      const currentPageIds = currentPageMembers.map((member) => member.id);
      setSelectedRows(currentPageIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    const index = selectedRows.indexOf(id);
    if (index === -1) {
      setSelectedRows([...selectedRows, id]);
    } else {
      const updatedSelectedRows = [...selectedRows];
      updatedSelectedRows.splice(index, 1);
      setSelectedRows(updatedSelectedRows);
    }
  };

  const visibleMembers = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div>
      <h2>Member List</h2>
      <div style={{ display: "flex", alignItems: "center" }}>
        <input type="text" placeholder="Search..." onChange={handleSearch} />
        <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
          Delete Selected
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visibleMembers.map((member) => (
            <tr
              key={member.id}
              style={{
                background: selectedRows.includes(member.id)
                  ? "#808080"
                  : "transparent",
              }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(member.id)}
                  onChange={(e) => handleCheckboxChange(e, member.id)}
                />
              </td>

              <td>
                {editingId === member.id ? (
                  <input
                    value={editedMember.id}
                    onChange={(e) =>
                      setEditedMember({ ...editedMember, id: e.target.value })
                    }
                  />
                ) : (
                  member.id
                )}
              </td>
              <td>
                {editingId === member.id ? (
                  <input
                    value={editedMember.name}
                    onChange={(e) =>
                      setEditedMember({ ...editedMember, name: e.target.value })
                    }
                  />
                ) : (
                  member.name
                )}
              </td>
              <td>
                {editingId === member.id ? (
                  <input
                    value={editedMember.email}
                    onChange={(e) =>
                      setEditedMember({
                        ...editedMember,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  member.email
                )}
              </td>
              <td>
                {editingId === member.id ? (
                  <input
                    value={editedMember.role}
                    onChange={(e) =>
                      setEditedMember({
                        ...editedMember,
                        role: e.target.value,
                      })
                    }
                  />
                ) : (
                  member.role
                )}
              </td>
              <td>
                {editingId === member.id ? (
                  <>
                    <button onClick={() => handleSave(member.id)}>Save</button>
                    <button onClick={() => handleCancel()}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEdit(member.id)}>Edit</button>
                )}
                <button onClick={() => handleOneDelete(member.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(1)}
        >
          First
        </button>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          Last
        </button>
      </div>
    </div>
  );
}

export default MemberList;
