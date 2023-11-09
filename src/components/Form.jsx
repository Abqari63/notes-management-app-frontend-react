import axios from 'axios';
import React, { useState, useEffect } from 'react';
import NoteTable from './NoteTable';

const Form = () => {
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
    });


    const [response, setResponse] = useState({
        rows: null,
        error: ''
    });
    const [alert, setAlert] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };
    const [editNoteID, setEditNoteID] = useState(null);
    const [confirmDeleteModal, setConfirmDeleteModal] = useState(false)
    const [deleteNoteID, setDeleteNoteID] = useState(null);

    const ValidateNote = () => {
        const validationErrors = {};

        if (formData.title.trim() === '') {
            validationErrors.title = 'Title is required...!';
        }

        if (formData.desc.trim() === '') {
            validationErrors.desc = 'Description is required...!'
        }

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    }

    const addNote = async (e) => {
        e.preventDefault();

        if (ValidateNote()) {
            try {
                const res = await axios.post(
                    'http://localhost/php_CRUD/addNote.php',
                    formData,
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                )
                setAlert(res.data);
                fetchingData();
            } catch (error) {
                console.log(error);
            }
        }
        setFormData({ title: '', desc: '' });
    }

    const deleteNoteModal = id => {
        setConfirmDeleteModal(true);
        setDeleteNoteID(id);
    }

    const deleteNote = async () => {

        try {
            const res = await axios.post(
                'http://localhost/php_CRUD/deleteNote.php',
                { deleteNoteID },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            setAlert(res.data);
            fetchingData();
        } catch (error) {
            console.log(error);
        }
        setConfirmDeleteModal(false);
    }

    const cancelDeleteNote = () => {
        setConfirmDeleteModal(false);
        setDeleteNoteID(null);
    }


    const editNote = id => {

        const noteToEdit = response.rows.find(note => { return note[0] === id });

        if (noteToEdit) {
            setFormData({
                title: noteToEdit[1],
                desc: noteToEdit[2],
            });
            setEditNoteID(id);
        }
    };

    const updateNote = async (e) => {

        e.preventDefault();
        if (ValidateNote() && editNoteID !== null) {
            try {
                const res = await axios.post(
                    'http://localhost/php_CRUD/editNote.php',
                    { id: editNoteID, title: formData.title, desc: formData.desc },
                    {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );
                setAlert(res.data);
                fetchingData();
                setEditNoteID(null);
            } catch (error) {
                console.log(error);
            }
        }
        setFormData({ title: '', desc: '' });
    };

    const fetchingData = async () => {
        try {
            const res = await axios.get(
                'http://localhost/php_CRUD/fetchData.php',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            )
            if (!Array.isArray(res.data)) {
                setResponse({ error: res.data });
            } else {
                setResponse({ rows: res.data });
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchingData();
    }, []);

    useEffect(() => {
        setShowAlert(true);
        const timeout = setTimeout(() => {
            setShowAlert(false);
            setAlert('');
        }, 3000);
        return () => clearTimeout(timeout);
    }, [alert]);

    const buttonLabel = editNoteID ? 'Edit Note' : 'Add Note';

    return (
        <div className="absolute z-10 flex gap-10 justify-center items-center w-full h-full bg-gray-100">
            <div className="message fixed top-0 z-20 w-full h-10">
                {showAlert && alert && <div className="alert p-5 font-inter text-lg text-green-800 bg-green-300">
                    {alert}
                </div>}
            </div>
            <div className="bg-white mt-10 p-8 rounded shadow-md w-full sm:w-96">
                <h2 className="text-2xl font-semibold mb-4">{editNoteID ? 'Edit note' : 'Add note'}</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700">
                            Note title
                        </label>
                        <input
                            type="text"
                            id="noteTitle"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 p-2 border w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter note title"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="noteDescription" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="noteDescription"
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 p-2 border w-full rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter note description"
                        ></textarea>
                        {errors.desc && <p className="text-red-500 text-sm">{errors.desc}</p>}
                    </div>
                    <button
                        type="submit"
                        onClick={editNoteID ? updateNote : addNote}
                        className="w-full bg-gradient-to-b from-blue-500 to-blue-700 hover:bg-gradient-to-b hover:from-blue-700 hover:to-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none active:bg-blue-700 duration-300"
                    >
                        {buttonLabel}
                    </button>
                </form>
            </div>
            <div className="p-20">
                {response.error ? (<h2 className="text-3xl font-bold text-red-500">Some Database Error Occured...!</h2>)
                    : (<NoteTable deleteNoteModal={deleteNoteModal} editNote={editNote} response={response} />)
                }
            </div>

            {confirmDeleteModal && <div className="modal absolute z-30 w-full h-full bg-gray-400 opacity-50 flex justify-center items-center"></div>}
            {confirmDeleteModal && <div className="absolute top-0 w-full h-full z-40 flex justify-center items-center">
                <div className="modal-content flex flex-col w-fit h-fit p-5 bg-white rounded-md text-black">
                    <h3 className="text-xl font-semibold text-center">Are you sure you want to delete this note ?</h3>
                    <div className="flex items-center justify-end gap-5 my-10">
                        <button onClick={deleteNote} className="px-4 py-2 rounded-lg text-white bg-red-500  hover:bg-red-600 hover:scale-105 duration-75 text-lg">Delete</button>
                        <button onClick={cancelDeleteNote} className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-300 hover:scale-105 duration-75 text-lg">Cancel</button>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default Form;
