import React from 'react'
import PropTypes from 'prop-types';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Unstable_Grid2 } from '@mui/material';
import axios from 'axios';
import { urlApi, urlUser } from '../api/myApiData';
import { FilterListRounded } from '@mui/icons-material';


export const MyDialogDelete = (props) => {
    const Title = props.Title;
    const Description = props.Description;
    const FuncDelete = props.FuncDelete;
    const handleCloseDialog = props.handleCloseDialog;
    const openDialogDelete = props.openDialogDelete;
    const scrollDialog = props.scrollDialog;

    return (
        <Dialog open={openDialogDelete} onClose={handleCloseDialog} scroll={scrollDialog} >
            <DialogTitle >{Title}</DialogTitle>
            <DialogContent dividers={scrollDialog === 'paper'}>
                <DialogContentText tabIndex={-1}>
                    {Description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancelar</Button>
                <Button onClick={FuncDelete}>Eliminar</Button>
            </DialogActions>
        </Dialog>
    )
}

MyDialogDelete.propTypes = {
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    FuncDelete: PropTypes.func.isRequired,
    handleCloseDialog: PropTypes.func.isRequired,
    openDialogDelete: PropTypes.bool.isRequired,
    scrollDialog: PropTypes.string.isRequired,

};


export const MyDialogEdit = (props) => {
    const Title = props.Title;
    const Description = props.Description;
    const FuncEdit = props.FuncEdit;
    const handleCloseDialog = props.handleCloseDialog;
    const openDialogEdit = props.openDialogEdit;
    const scrollDialog = props.scrollDialog;
    const Conten = props.Conten;


    return (
        <Dialog open={openDialogEdit} onClose={handleCloseDialog} scroll={scrollDialog} >
            <DialogTitle >
                {Title}
            </DialogTitle>
            <DialogContent dividers={scrollDialog === 'paper'}>
                <DialogContentText tabIndex={-1}>
                    {Description}
                </DialogContentText>
                {Conten}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancelar</Button>
                <Button onClick={FuncEdit}>Editar</Button>
            </DialogActions>
        </Dialog>

    )
}

MyDialogEdit.propTypes = {
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    FuncEdit: PropTypes.func.isRequired,
    handleCloseDialog: PropTypes.func.isRequired,
    openDialogEdit: PropTypes.bool.isRequired,
    scrollDialog: PropTypes.string.isRequired,
    Conten: PropTypes.object.isRequired,
};

export const MyDialogCreate = (props) => {
    const Title = props.Title;
    const Description = props.Description;
    const FuncCreate = props.FuncCreate;
    const handleCloseDialog = props.handleCloseDialog;
    const openDialogCreate = props.openDialogCreate;
    const scrollDialog = props.scrollDialog;
    const Conten = props.Conten;


    return (
        <Dialog open={openDialogCreate} onClose={handleCloseDialog} scroll={scrollDialog} >
            <DialogTitle >
                {Title}
            </DialogTitle>
            <DialogContent dividers={scrollDialog === 'paper'}>
                <DialogContentText tabIndex={-1}>
                    {Description}
                </DialogContentText>
                {Conten}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancelar</Button>
                <Button onClick={FuncCreate}>Crear</Button>
            </DialogActions>
        </Dialog>
    )
}

MyDialogCreate.propTypes = {
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    FuncCreate: PropTypes.func.isRequired,
    handleCloseDialog: PropTypes.func.isRequired,
    openDialogCreate: PropTypes.bool.isRequired,
    scrollDialog: PropTypes.string.isRequired,
    Conten: PropTypes.object.isRequired,
};

