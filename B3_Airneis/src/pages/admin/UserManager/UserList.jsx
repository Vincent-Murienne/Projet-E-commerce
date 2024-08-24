import { useAsyncList, useCollator, TableView, TableHeader, TableBody, Column, Row, Cell, Image, Item, ActionMenu } from '@adobe/react-spectrum';
import { Data } from '../../../services/api';
import { ToastQueue } from '@react-spectrum/toast';
import { UserContext } from '../../../context/UserProvider';
import { useContext } from 'react';
import { Link, useNavigate } from "react-router-dom";

function UserList() {

    // This block of code is used to retrieve the data from the api and then sort the data if needed on what it needs to be sorted if the user selected one column
    let collator = useCollator({ numeric: true });

    // Make an API call to get all the users informations. We use useAsyncList function that allows the filtering on specific columns to be dynamic
    const data = {
        "table": "users"
    };

    let list = useAsyncList({
        async load() {
            try {
                const response = await Data("panelAdmin", "getAllUsers", data);
                if (response.success === true) {
                    return {
                        items: response.data
                    };
                } else {
                    ToastQueue.negative(response.error, {timeout: 5000});
                }
            } catch (error) {
                ToastQueue.negative("Error fetching data", {timeout: 5000});
            }
        },
        async sort({ items, sortDescriptor }) {
        return {
            items: items.sort((a, b) => {
            let first = a[sortDescriptor.column];
            let second = b[sortDescriptor.column];
            let cmp = collator.compare(first, second);
            if (sortDescriptor.direction === 'descending') {
                cmp *= -1;
            }
            return cmp;
            })
        };
        }
    });

    // This part is used when the user select the action button on the table. We will either edit or delete the row.

    const { saveData } = useContext(UserContext);
    const navigate = useNavigate();

    const action = (key, id) => {
        if(key === "edit"){
            // If the user clicked on the edit button, we build the url to the specific element and navigates towards it
            let editUrl = "/admin/UserManager/Edit/" + id;
            navigate(editUrl);
        } else if(key === "delete"){
            // If the user clicked on the delete button, we are going to delete the specific element
            const confirmed = window.confirm("Voulez-vous vraiment supprimer cet élément ?");
            if (confirmed) {
                // If success, we are going to delete the element from the database
                const data_delete = {
                    "id": id
                };
    
                Data("panelAdmin", "deleteUser", data_delete).then(response => {
                    if (response.success === true)
                    {
                        saveData("message", {type: "success", body: "Suppression réussite avec succès !"}); // This line is used to store the message into the cookies to display it after the reload of the page
                        window.location.reload();
                    }
                    else
                    {
                        ToastQueue.negative(response.error, {timeout: 5000});
                    }
                });
            }
        }
    };

    return (
        <>
            <section className="tableContainer">
                <Link to="/admin/UserManager/Add" className="add-btn form-btn-success">Ajouter un utilisateur</Link>
                <TableView
                aria-label="Table with client side sorting"
                sortDescriptor={list.sortDescriptor}
                onSortChange={list.sort}
                selectionMode="single"
                selectionStyle="highlight"
                density="spacious"
                marginTop={20}
                >
                    <TableHeader>
                        <Column key="id" allowsSorting showDivider="true" width={50}>ID</Column>
                        <Column key="full_name" allowsSorting showDivider="true">Nom Complet</Column>
                        <Column key="email" allowsSorting showDivider="true">Email</Column>
                        <Column key="role" allowsSorting showDivider="true" width={50} align="end">Rôle</Column>
                        <Column key="action" showDivider="true" width={50} align="end">Action</Column>
                    </TableHeader>
                    <TableBody
                        items={list.items}
                        loadingState={list.loadingState}
                    >
                        {(item) => (
                        <Row key={item.id}>
                            {
                                (columnKey) => {
                                    return (
                                        (columnKey === "action")
                                        ?
                                            <Cell>
                                                <ActionMenu onAction={(key) => action(key, item.id)}>
                                                    <Item key="edit" textValue="Edit">Edit</Item>
                                                    <Item key="delete" textValue="Delete">Delete</Item>
                                                </ActionMenu>
                                            </Cell>
                                        :
                                            <Cell>{item[columnKey]}</Cell>
                                    );
                                }
                            }
                        </Row>
                        )}
                    </TableBody>
                </TableView>
            </section>
        </>
    );
};

export default UserList;