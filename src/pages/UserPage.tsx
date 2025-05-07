import { Button, ButtonGroup, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import CustomNavbar from "../components/navbar/CustomNavbar";
import CustomPagination from "../components/CustomPagination";
import { useEffect, useState } from "react";
import { User } from "../models/user";
import userService from "../services/userService";

const UserPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [currentUser, setCurrentUser] = useState<User>();
    const [showUpdateUserModal, setShowUpdateUserModal] = useState(false);

    const handleUpdateUserClose = () => setShowUpdateUserModal(false);
    const handleUpdateUserClick = () => setShowUpdateUserModal(true);


    if (!currentUser) {
        userService.getCurrentUser().then(user => {
            setCurrentUser(user);
        });
    }

    const findAllUsers = async (size: number) => {
        userService.findAll(currentPage, size).then(response => {
        const userContentArr = response.content || [];

        setUsers(userContentArr);
        setTotalUsers(response?.totalElements || 0);
        });
    };

    useEffect(() => {
        findAllUsers(pageSize);
    }, [currentPage, pageSize]);

    const processUserDeletion = async (userId: number) => {
        try {
          userService.deleteById(userId);
          userService.findAll().then(data => setUsers(data));
        } catch (error) {
          console.error("Failed to delete selected user", error);
        }
    };

    const onPageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectElement = event.target;
        const newValue = parseInt(selectElement.value, 10);
        setPageSize(newValue);
        findAllUsers(newValue);
    }

    return (
        <>
            <CustomNavbar />

            <Container>
                <Row className="justify-content-center mt-4">
                    <Col md={2}>
                        <CustomPagination
                        itemsCount={totalUsers}
                        itemsPerPage={pageSize}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        alwaysShown={true}
                        />
                    </Col>
                    <Col md={{ span: 1, offset: 4 }}>
                        <Form.Select className="custom-select custom-select-sm" onChange={onPageSizeChange}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        </Form.Select>
                    </Col>
                </Row>
                <Row className="justify-content-center">
                    <Card className="mb-3" style={{ width: "800px" }}>
                        {users.map((user) => user.id !== currentUser?.id && (
                            <>
                                <Card.Header>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>User #{user.id}</span>
                                    <ButtonGroup>
                                        <Button 
                                            variant="outline-secondary" 
                                            size="sm"
                                            onClick={handleUpdateUserClick}
                                        >change role
                                        </Button>
                                        <Button 
                                            variant="outline-danger" 
                                            size="sm"
                                            onClick={() => processUserDeletion(user.id!)}
                                        >
                                        delete
                                        </Button>
                                    </ButtonGroup>
                                </div>
                                </Card.Header>

                                <Card.Body>
                                    <Card.Text>
                                        Email: {user.email}
                                    </Card.Text>
                                    <Card.Text>
                                        Fullname: {user.firstName}{user.lastName}
                                    </Card.Text>
                                    <Card.Text>
                                        Username: {user.username}
                                    </Card.Text>
                                    <Card.Text>
                                        Role: {user.role}
                                    </Card.Text>
                                </Card.Body>
                            </>
                        ))}
                    </Card>
                </Row>
                
                <Row className="justify-content-md-center">
                    <Col md={2}>
                        <CustomPagination
                        itemsCount={totalUsers}
                        itemsPerPage={pageSize}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        alwaysShown={true}
                        />
                    </Col>
                    <Col md={{ span: 1, offset: 4 }}>
                        <Form.Select className="custom-select custom-select-sm" onChange={onPageSizeChange}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Container>

            <Modal
                show={showUpdateUserModal}
                onHide={handleUpdateUserClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update user</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>New role</Form.Label>
                    <Form.Select>
                        <option>Default select</option>
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary">Update</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UserPage;
