import { useState, useEffect } from 'react';
import API_URL from './apiConfig';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setError(null);
                setLoading(true);
                const response = await fetch(`${API_URL}/contacts`);
                if (!response.ok) {
                    throw new Error("Failed to fetch contacts");
                }
                const data = await response.json();
                setContacts(data);
            } catch (error) {
                setError("There was an Error loading contacts: " + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

    if (loading) {
        return <p>Loading contacts...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className="container">
            <h2 className="text-center mt-4">Contacts List</h2>
            <ul className="list-group">
                {contacts.map((contact) => (
                    <li key={contact._id} className="list-group-item d-flex align-items-center">
                        {contact.image_url && (
                            <img
                                src={contact.image_url}
                                alt={contact.contact_name}
                                style={{ width: '50px', height: '50px', marginRight: '15px', objectFit: 'cover' }}
                            />
                        )}
                        <div>
                            <strong>{contact.contact_name}</strong> - {contact.phone_number}
                            <p>{contact.message}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default Contacts;
