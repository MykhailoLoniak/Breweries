"use client";

import React from "react";

interface DeleteSelectedButtonProps {
  count: number;
  onDelete: () => void;
}

const DeleteSelectedButton: React.FC<DeleteSelectedButtonProps> = ({
  count,
  onDelete,
}) => {
  if (count === 0) return;

  return (
    <button type="button" onClick={onDelete} className="px-3 py-1 border rounded text-sm">
      Delete ({count})
    </button>
  );
};

export default DeleteSelectedButton