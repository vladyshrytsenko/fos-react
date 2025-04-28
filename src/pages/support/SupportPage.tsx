import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Badge, Modal } from "react-bootstrap";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { useNavigate } from "react-router-dom";
import supportService from "../../services/supportService";
import { ChatSupport, Message, MessageStatus, Topic } from "../../models/chat-support";

const UserTopicsPage: React.FC = () => {
  const navigate = useNavigate();

  const [showCreateNewTopicModal, setShowCreateNewTopicModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [chats, setChats] = useState<ChatSupport[]>([]);

  const handleCloseModal = () => setShowCreateNewTopicModal(false);
  const handleShowModal = () => setShowCreateNewTopicModal(true);

  const handleCreateNewSupportChatSubmit = async () => {
    try {
      const createdChat = await supportService.create({
        subject: newSubject,
        message: {
          content: newMessageText,
          attachments: []
        }
      });
  
      setChats([...chats, createdChat]);
      setShowCreateNewTopicModal(false);
    } catch (error) {
      console.error("Error creating a new topic", error);
    }
  };

  const navigateToChat = (chatId: number) => {
    console.log("Card clicked");
    navigate(`/support/chat/${chatId}`);
  };
  
  return (
    <>
      <CustomNavbar />

      <Container>
        <h2>My topics</h2>
        <Button variant="primary" onClick={handleShowModal}>Create a new topic</Button>

        <Row className="justify-content-center">
          { chats.map((chat) => (
            <Card key={chat.id} className="mt-2" style={{ width: "800px" }}>
              <Card.Header>
                Status{" "}
                {chat.status === "OPEN" ? (
                <Badge bg="info" text="light">Open</Badge>
                ) : chat.status === "ASSIGNED" ? (
                  <Badge bg="success">Assigned</Badge>
                ) : chat.status === "CLOSED" ? (
                  <Badge bg="danger">Closed</Badge>
                ) : null}
              </Card.Header>
              <Card.Body>
                <blockquote className="blockquote mb-0">
                  <p>{chat.subject}</p>
                </blockquote>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>

      <Modal 
        size="lg"
        show={showCreateNewTopicModal}
        onHide={handleCloseModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>A new topic content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Subject</Form.Label>
              <Form.Control 
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                autoFocus/>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={3} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleCreateNewSupportChatSubmit}>Create topic</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
  
export default UserTopicsPage;
  