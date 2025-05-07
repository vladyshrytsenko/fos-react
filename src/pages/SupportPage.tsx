import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Badge, Modal, ListGroup, Tab, Navbar } from "react-bootstrap";
import CustomNavbar from "../components/navbar/CustomNavbar";
import supportService from "../services/supportService";
import { ChatSupport, MessageStatus, Topic } from "../models/chat-support";
import uuid from 'react-uuid';
import { User } from "../models/user";
import userService from "../services/userService";
import { connectWebSocket, dissconnectWebSocket, sendMessage } from "../services/supportWebSocket";

interface Message {
    chatId: string, 
    senderId: number, 
    content: string,
    attachments?: any[],
    createdAt: Date
};

const UserTopicsPage: React.FC = () => {
  const [showCreateNewTopicModal, setShowCreateNewTopicModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [chats, setChats] = useState<ChatSupport[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(30);
  const [totalChats, setTotalChats] = useState<number>(0);
  const [selectedChatId, setSelectedChatId]  = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState<User>();

  if (!currentUser) {
    userService.getCurrentUser().then(user => {
        setCurrentUser(user);
    });
  }

  const handleCloseModal = () => setShowCreateNewTopicModal(false);
  const handleShowModal = () => setShowCreateNewTopicModal(true);

  const findAllChatsByCustomer = async (size: number) => {
    supportService.findAllChatsForCustomer(currentPage, size).then(response => {
      console.log("currentPage", currentPage, "size", size);
      setChats(response.content);
      setTotalChats(response?.totalElements || 0);
    });
  };

  useEffect(() => {
    findAllChatsByCustomer(pageSize);
  }, [currentPage, pageSize]);
  
  const handleSend = () => {
    if (input.trim()) {
      sendMessage({
        chatId: selectedChatId!,
        senderId: currentUser!.id!,
        senderName: currentUser!.username,
        senderRole: currentUser!.role!,
        content: input,
        status: MessageStatus.Delivered, //fixme
        attachments: [] //fixme
      });
      setInput('');
    }
  }

  const onChatSelection = (chatId: string) => {
    if ((selectedChatId && selectedChatId !== chatId) || !selectedChatId) {
      setSelectedChatId(chatId);

      setMessages([]);
      connectWebSocket(chatId, (messages) => {
        setMessages([...messages]);
      });

      return () => {
        dissconnectWebSocket();
      };
    }
  };

  const handleCreateNewSupportChatSubmit = async () => {
    try {
      const createdChat = await supportService.create({
        subject: newSubject,
        message: {
          chatId: uuid().toString(),
          content: newMessageText,
          attachments: []
        }
      });
  
      setChats([...chats, createdChat]);
      setShowCreateNewTopicModal(false);
      setNewSubject('');
      setNewMessageText('');
    } catch (error) {
      console.error("Error creating a new topic", error);
    }
  };
  
  return (
    <>
      <CustomNavbar />

      <Button variant="primary" onClick={handleShowModal} size="sm">New topic</Button>
      
      <Tab.Container id="list-group-tabs-example">
        <Row>
          <Col sm={3}>
            <ListGroup as="ol">
              {chats.map((chat) => (
                <ListGroup.Item
                  as="li"
                  className="d-flex justify-content-between align-items-start"
                  action href={`#chat:${chat.id}`}
                  onClick={() => onChatSelection(chat.id)}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{chat.subject}</div>
                    {chat.lastMessagePreview}
                  </div>
                  <Badge bg="dark" text="light" pill> {chat.messages.length} </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {chats.map((chat) => (
                <Tab.Pane eventKey={`#chat:${chat.id}`}>
                  <Navbar bg="light" data-bs-theme="light">
                    <Container>
                      <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
                      <Navbar.Toggle />
                      <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                          Signed in as: <a href="#login">Mark Otto</a>
                        </Navbar.Text>
                      </Navbar.Collapse>
                    </Container>
                  </Navbar>

                  <Container style={{ height: "75vh", display: "flex", flexDirection: "column", paddingTop: "1rem" }}>
      
                    <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px", marginBottom: "1rem" }}>
                      {messages.map((msg) => (
                        <Row 
                          key={msg.chatId}
                          className="mb-2"
                          style={{ justifyContent: currentUser!.id === msg.senderId ? "flex-end" : "flex-start" }}
                        >
                          <Col xs={6}>
                            <Card
                              bg={currentUser!.id === msg.senderId ? "secondary" : "light"}
                              text={currentUser!.id === msg.senderId ? "white" : "dark"}
                              className="p-2"
                              style={{ borderRadius: "1rem" }}
                            >
                              <Card.Header>
                                {currentUser!.id === msg.senderId ? `${currentUser!.username} | ${msg.createdAt}` : "Support Agent"}
                              </Card.Header>
                              <Card.Body>
                                <Card.Text>{msg.content}</Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      ))}
                    </div>

                    <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                      <Form.Group className="d-flex">
                        <Form.Control
                          type="text"
                          placeholder="Enter your question..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                        />
                        <Button variant="primary" onClick={handleSend} className="ms-2" disabled={!input}>Send</Button>
                      </Form.Group>
                    </Form>
                  </Container>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

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
            <Form.Group className="mb-3"
             >
              <Form.Label>Subject</Form.Label>
              <Form.Control 
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
            >
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea" 
                rows={3} 
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
              />
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
