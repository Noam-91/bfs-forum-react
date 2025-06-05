// AlertContext.tsx
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { Alert, AlertTitle, Snackbar } from '@mui/material';

interface AlertContextProps {
    showAlert: (severity: 'error' | 'warning' | 'info' | 'success', title: string, message: string) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertSeverity, setAlertSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('info');
    const [alertTitle, setAlertTitle] = useState<string>('');
    const [alertMessage, setAlertMessage] = useState<string>('');

    const showAlert = (severity: 'error' | 'warning' | 'info' | 'success', title: string, message: string) => {
        setAlertSeverity(severity);
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertOpen(true);
    };

    const hideAlert = () => {
        setAlertOpen(false);
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <Snackbar
                open={alertOpen}
                autoHideDuration={3000}                                 // Show 3s
                onClose={hideAlert}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                sx={{minWidth:1/3, borderRadius:20, opacity:.8}}
            >
                <Alert onClose={hideAlert} severity={alertSeverity} sx={{ width: '100%', fontSize:'.8rem' }} >
                    <AlertTitle sx={{ width: '100%', fontSize:'.8rem' }} >{alertTitle}</AlertTitle>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </AlertContext.Provider>
    );
};
