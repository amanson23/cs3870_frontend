import React, { useState } from "react";
function DeleteContact() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const handleDelete = async (e) => {
        e.preventDefault();
        setMessage("");
        const trimmedName = name.trim();
        if (!trimmedName) {
            setMessage("Please enter a contact name.");
            return;
        }
        try {
            const encodedName = encodeURIComponent(trimmedName);
            console.log("EncodeURIComponent :", encodedName);
            const res = await fetch(`https://cs3870-backend-p3an.onrender.com/contacts/${encodedName}`, {
                method: "DELETE",
            });

            const data = await res.json().catch(() => null);
            
            if (!res.ok) {
                const errorMsg = data?.message || `Error: HTTP ${res.status}`;
                setMessage(errorMsg);
            } else {
                const successMsg =
                    data?.message || `Contact '${trimmedName}' was deleted successfully.`;
                setMessage(successMsg);
                setName(""); // clear input
            }
        } catch (error) {
            console.error("Error deleting contact:", error);
            setMessage("Network error while deleting contact.");
        }
    };
    return (
        <div>
            <h2>Delete Contact</h2>
            <form onSubmit={handleDelete}>
                <label>
                    Contact Name:
                    <input
                        type="text"
                        value={name}
                        placeholder="e.g. Abraham Aldaco"
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                <button type="submit">Delete</button>
            </form>
            {message && <p>{message}</p>}
        </div>

    );
}
export default DeleteContact;
