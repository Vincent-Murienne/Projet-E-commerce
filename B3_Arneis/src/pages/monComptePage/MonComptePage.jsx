import React, { useState, useContext } from "react";
import { UserContext } from "../../context/UserProvider";

const MonComptePage = () => {
    const { user, updateUser } = useContext(UserContext);

    const [fullName, setFullName] = useState(user.fullName);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        updateUser({ fullName, email, password });
    };

    return (
        <div>
            <h2>Paramètres du compte</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom complet:</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
                <div>
                    <label>E-mail:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Mot de passe:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Enregistrer les modifications</button>
            </form>
        </div>
    );
};

export default MonComptePage;
