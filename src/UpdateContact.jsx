import React, { useState, useEffect } from "react";

export default function UpdateContact() {
    const [contacts, setContacts] = useState([]);
    const [selectedContactName, setSelectedContactName] = useState("");
    const [contactDetails, setContactDetails] = useState({
        contact_name: "",
        phone_number: "",
        message: "",
        image_url: "",
    });
    const [responseMsg, setResponseMsg] = useState("");

    // Fetch all contacts for the dropdown
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch("https://cs3870-backend-p3an.onrender.com/contacts");
                if (!response.ok) {
                    throw new Error("Failed to fetch contacts");
                }
                const data = await response.json();
                setContacts(data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
                setResponseMsg("Error loading contacts.");
            }
        };
        fetchContacts();
    }, []);

    // When a contact is selected, populate the form
    useEffect(() => {
        if (selectedContactName) {
            const selected = contacts.find(c => c.contact_name === selectedContactName);
            if (selected) {
                setContactDetails(selected);
            }
        } else {
            // Clear form if no contact is selected
            setContactDetails({ contact_name: "", phone_number: "", message: "", image_url: "" });
        }
    }, [selectedContactName, contacts]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactDetails(prevDetails => ({ ...prevDetails, [name]: value }));
    };

    const handleUpdateContact = async (e) => {
        e.preventDefault();
        setResponseMsg("");

        if (!selectedContactName) {
            setResponseMsg("Please select a contact to update.");
            return;
        }

        try {
            const encodedName = encodeURIComponent(selectedContactName);
            const res = await fetch(`https://cs3870-backend-p3an.onrender.com/contacts/${encodedName}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contactDetails),
            });

            const data = await res.json().catch(() => null);

            if (res.ok) {
                setResponseMsg(`Contact '${selectedContactName}' updated successfully!`);
                // Optionally, refresh contacts list and clear form
                setSelectedContactName("");
                const updatedContacts = contacts.map(c => c.contact_name === selectedContactName ? contactDetails : c);
                setContacts(updatedContacts);
            } else {
                setResponseMsg(data?.message || "Failed to update contact.");
            }
        } catch (error) {
            console.error("PUT error:", error);
            setResponseMsg("Network error: Could not connect to the server.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Update Contact</h2>
            <form onSubmit={handleUpdateContact}>
                <label>
                    Select Contact to Update:
                    <select value={selectedContactName} onChange={(e) => setSelectedContactName(e.target.value)}>
                        <option value="">-- Select a Contact --</option>
                        {contacts.map((contact) => (
                            <option key={contact._id || contact.contact_name} value={contact.contact_name}>
                                {contact.contact_name}
                            </option>
                        ))}
                    </select>
                </label>
                <br /><br />
                {selectedContactName && (
                    <div>
                        <input
                            type="text" name="contact_name" placeholder="Full Name"
                            value={contactDetails.contact_name} onChange={handleInputChange}
                        /><br /><br />
                        <input
                            type="text" name="phone_number" placeholder="Phone Number"
                            value={contactDetails.phone_number} onChange={handleInputChange}
                        /><br /><br />
                        <input
                            type="text" name="message" placeholder="Message"
                            value={contactDetails.message} onChange={handleInputChange}
                        /><br /><br />
                        <input
                            type="text" name="image_url" placeholder="Image URL"
                            value={contactDetails.image_url} onChange={handleInputChange}
                        /><br /><br />
                        <button type="submit">Update Contact</button>
                    </div>
                )}
            </form>
            {responseMsg && (
                <p style={{ marginTop: "15px", color: "blue" }}>{responseMsg}</p>
            )}
        </div>
    );
}