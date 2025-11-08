import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import {Snackbar, Alert} from '@mui/material';

interface ToastContextType {
    showError: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

// Singleton toast service for use outside React components (e.g., in Repository classes)
class ToastService {
    private static instance: ToastService;
    private showErrorFn?: (message: string) => void;

    private constructor() {}

    static getInstance(): ToastService {
        if (!ToastService.instance) {
            ToastService.instance = new ToastService();
        }
        return ToastService.instance;
    }

    register(showError: (message: string) => void) {
        this.showErrorFn = showError;
    }

    showError(message: string) {
        if (this.showErrorFn) {
            this.showErrorFn(message);
        } else {
            console.error('ToastService not initialized:', message);
        }
    }
}

export const toastService = ToastService.getInstance();

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({children}) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    const showError = (message: string) => {
        setMessage(message);
        setOpen(true);
    };

    // Register the showError function with the singleton service
    useEffect(() => {
        toastService.register(showError);
    }, []);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <ToastContext.Provider value={{showError}}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};
