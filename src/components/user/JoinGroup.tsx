import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import GroupRepository from "../../repository/GroupRepository.ts";

export default function JoinGroup() {
    const { uid } = useParams<{ uid: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const joinGroup = useCallback(() => {
        if (!uid) {
            setError("Invalid group invitation link");
            setLoading(false);
            return;
        }

        const repository = new GroupRepository();
        repository.joinGroup(
            uid,
            () => {
                setLoading(false);
                navigate("/profile");
            },
            () => {
                setError("Failed to join group. The invitation may be invalid or expired.");
                setLoading(false);
            }
        );
    }, [uid, navigate]);

    useEffect(() => {
        joinGroup();
    }, [joinGroup]);

    if (loading) {
        return (
            <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                minHeight="60vh"
                gap={2}
            >
                <CircularProgress />
                <Typography variant="h6">Joining group...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                minHeight="60vh"
                gap={2}
            >
                <Alert severity="error" sx={{ maxWidth: 400 }}>
                    {error}
                </Alert>
            </Box>
        );
    }

    return null;
}