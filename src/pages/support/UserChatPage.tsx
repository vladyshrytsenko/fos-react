import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Badge } from "react-bootstrap";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { connectWebSocket, dissconnectWebSocket, sendMessage, subscribeToChat } from "../../services/supportWebSocket";
import { useParams } from "react-router-dom";
import userService from "../../services/userService";
import { User } from "../../models/user";
import { MessageStatus } from "../../models/chat-support";

interface Message {
    chatId: string, 
    senderId: number, 
    content: string,
    attachments?: any[],
    createdAt: Date
};

const UserChatPage: React.FC = () => {
    const { chatId } = useParams<{chatId: string}>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [currentUser, setCurrentUser] = useState<User>();
    
    if (!currentUser) {
        userService.getCurrentUser().then(user => {
            console.log('currentUser', user);
            setCurrentUser(user);
        });
    }

    // window.scrollTo({
    //     top: document.documentElement.scrollHeight,
    //     behavior: 'auto'
    //     /* you can also use 'auto' behaviour 
    //        in place of 'smooth' */
    // });

    if (!chatId) {
        throw new Error('chatId is required in the URL');
    }

    useEffect(() => {
        if (chatId) {
            connectWebSocket(chatId, (messages) => {
                setMessages([...messages]);
            });
        }

        return () => {
            dissconnectWebSocket();
        };
    }, []);

    const handleSend = () => {
        if (input.trim()) {
            sendMessage({
                chatId: chatId,
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
  
    return (
      <>
        <CustomNavbar />

        <Container style={{ maxWidth: "1000px", height: "80vh", display: "flex", flexDirection: "column", paddingTop: "1rem" }}>
    
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
        
      </>
    );
  };
  
  export default UserChatPage;
  