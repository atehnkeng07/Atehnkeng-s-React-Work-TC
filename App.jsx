import { useState, useEffect } from 'react';

//AN ARRAY OF OBJECTS TO STORE THE DATA
const programData = [
    { name: 'JavaScript', color: 'teal' },
    { name: 'Java', color: 'cyan' },
    { name: 'Python', color: 'red' },
    { name: 'PHP', color: 'blue' },
    { name: 'C', color: 'pink' },

    { name: 'C++', color: 'gold' },
    { name: 'C#', color: 'green' },
];

const MAX_ATTEMPTS = 5; // Maximum number of attempts

function App() {
    const [language, setLanguage] = useState('');
    const [color, setColor] = useState('');
    const [errorMessages, setErrorMessages] = useState([]);
    const [attempts, setAttempts] = useState(0);
    const [successfulAttempts, setSuccessfulAttempts] = useState(0);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [lastAttempt, setLastAttempt] = useState(null);
    const [isMaxAttemptsReached, setIsMaxAttemptsReached] = useState(false);
    const [showLanguages, setShowLanguages] = useState(true);

    // Audio files inserted here
    const correctSound = new Audio('https://freesound.org/people/Thel200ster/sounds/654503/ '); // URL TO THE CORRECT SOUND
    correctSound.load();

    const failedSound = new Audio('https://freesound.org/browse/tags/you-failed/'); // URL TO THE FAILED SOUND
    failedSound.load();

    //Used the useEffect to help dispaly the the language and color before the start of the game
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLanguages(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const validateInfo = () => {
        // Check if max attempts is reached, then displays message
        if (attempts >= MAX_ATTEMPTS) {
            setIsMaxAttemptsReached(true);

            setErrorMessages(['Maximum attempts reached. Please try later.']);
            return;
        }

        const errors = []; // Defines an array to store the errors

        let foundLanguageMatch = false;
        let foundColorMatch = false;
        const trimmedLanguage = language.trim();
        const trimmedColor = color.trim();

        programData.forEach(data => {
            if (trimmedLanguage === data.name) {
                foundLanguageMatch = true;
            }

            if (trimmedColor === data.color) {
                foundColorMatch = true;
            }

            // Check for a complete match
            if (trimmedLanguage === data.name && trimmedColor === data.color) {
                correctSound.play(); // Plays correct sound here
                setSuccessfulAttempts(prev => prev + 1);

                setLastAttempt({ language: trimmedLanguage, color: trimmedColor, status: 'Success' });
                setErrorMessages(['Success! Your input matches an entry.']);

                return; // Exit the loop early since we found a complete match
            }
        });

        // After looping through all entries, check match statuses
        if (!foundLanguageMatch && !foundColorMatch) {
            errors.push('Neither the programming language nor the color matches any entry.');
            failedSound.play();
        }
         else if (foundLanguageMatch && !foundColorMatch) {
            errors.push('The programming language matches, but the color does not match any entry.');
            failedSound.play();
        } 
        else if (!foundLanguageMatch && foundColorMatch) {
            errors.push('The color matches, but the programming language does not match any entry.');
            failedSound.play();
        }

        if (errors.length > 0) {

            failedSound.play(); 
            
            setFailedAttempts(prev => prev + 1);
            setLastAttempt({ language: trimmedLanguage, color: trimmedColor, status: 'Error' });
        }

        setAttempts(prev => prev + 1);
        setErrorMessages(errors);
    };

    const handleLanguage = (e) => {
        setLanguage(e.target.value);
    };

    const handleColor = (e) => {
        setColor(e.target.value);
    };

    return (
        <div>
            {showLanguages ? (
                <div>
                    <h2>Available Programming Languages</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        {programData.map((data, index) => (
                            <div key={index} style={{ backgroundColor: data.color, padding: '10px', margin: '5px', color: 'white' }}>
                                {data.name}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <span>Programming Language</span>
                    <input
                        type="text"
                        onChange={handleLanguage}
                        disabled={isMaxAttemptsReached}
                    />

                    <span>Color</span>
                    <input
                        type="text"
                        onChange={handleColor}
                        disabled={isMaxAttemptsReached}
                    />

                    <button type="button" onClick={validateInfo} disabled={isMaxAttemptsReached}>Submit</button>

                    {errorMessages.length > 0 && (
                        <div style={{ color: 'red' }}>
                            {errorMessages.map((msg, index) => (
                                <p key={index}>{msg}</p>
                            ))}
                        </div>
                    )}

                    <h2>Attempt Records</h2>
                    <table style={{ border: '1px solid black', marginTop: '10px', width: '100%' }}>
                        <thead>
                            <tr>
                                <th>Programming Language</th>
                                <th>Total Attempts</th>
                                <th>Successful Attempts</th>
                                <th>Failed Attempts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lastAttempt && (
                                <tr style={{ backgroundColor: programData.find(data => data.name === lastAttempt.language)?.color }}>
                                    <td>{lastAttempt.language}</td>
                                    <td>{attempts}</td>
                                    <td>{successfulAttempts}</td>
                                    <td>{failedAttempts}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default App;