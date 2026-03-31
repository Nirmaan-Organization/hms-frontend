import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { NotificationManager } from 'react-notifications';

export default function DeleteCampDet({ deleteItem, data, isDeletePop, OnDeletePopClose, userId, fetchData }) {

    const apiUrl = process.env.REACT_APP_API_URL;

    const [url, setUrl] = useState('');

    useEffect(() => {
        let urlPath;
        switch (deleteItem) {
            case 'Camp':
                urlPath = 'deleteCamp';
                break;
            case 'Patient':
                urlPath = 'deletePatientDet';
                break;
            case 'Volunteer':
                urlPath = 'deleteVolunteer';
                break;
            case 'User':
                urlPath = 'deleteUser';
                break;
            default:
                break;
        }
        setUrl(urlPath);
    }, [deleteItem]);

    const deleteCampDet = async (row) => {
        let payload = {
            "created_by": userId
        }

        try {
            const res = await fetch(`${apiUrl}/${url}/${data.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                NotificationManager.success(data.message)
                fetchData();
                OnDeletePopClose();
            } else {
                const data = await res.json();
                NotificationManager.error(data.message)
            }
        } catch (error) {
            NotificationManager.error(error)
        }
    }
    return (
        <>
            <Dialog
                open={isDeletePop}
                onClose={OnDeletePopClose}
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure want to delete {deleteItem} Details?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={OnDeletePopClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteCampDet}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
