import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import CustomNavbar from "../../components/navbar/CustomNavbar";
import { connectWebSocket, dissconnectWebSocket, sendMessage, subscribeToChat } from "../../services/supportWebSocket";

interface Message {
    chatId: string, 
    senderId: number, 
    content: string,
    attachments?: any[]
};

const UserChatPage: React.FC = () => {
    const selectedChatId = "mock";
    const currentUserId = 1;
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        connectWebSocket((message) => {
            console.log('Connected, but not yet subscribed');
        });

        return () => {
            dissconnectWebSocket();
        };
    }, []);

    useEffect(() => {
        if (selectedChatId) {
            subscribeToChat(selectedChatId, (message) => {
                setMessages(prev => [...prev, message]);
            });
        }
    }, [selectedChatId]);

    const handleSend = () => {
        if (input.trim()) {
            sendMessage({
                chatId: selectedChatId,
                senderId: currentUserId,
                content: input,
                attachments: [] //fixme
            });
            setInput('');
        }
    }
  
    return (
      <>
        <CustomNavbar />

        <Container style={{ maxWidth: "1000px", height: "50vh", display: "flex", flexDirection: "column", paddingTop: "1rem"}}>
            <div style={{flex: 1, overflowY: "auto", marginBottom: "1rem"}}>
                {messages.map((msg) => (
                    <Row 
                        key={msg.chatId} 
                        className="mb-2" 
                        // style={{ justifyContent: msg.sender === "CLIENT" ? "flex-end" : "flex-start"}}
                    >
                        <Col xs={6}>
                            <Card 
                                // bg={msg.sender === "CLIENT" ? "info" : "light"}
                                // text={msg.sender === "CLIENT" ? "white" : "dark"}
                                className="p-2"
                                style={{ borderRadius: "1rem" }}
                            >
                                <Card.Title>User</Card.Title>
                                <Card.Text>{msg.content}</Card.Text>
                            </Card>
                        </Col>
                    </Row>
                ))}
            </div>

            <Form onSubmit={ (e) => { e.preventDefault(); handleSend(); }}>
                <Form.Group className="d-flex">
                    <Form.Control 
                        type="text" 
                        placeholder="Enter a message..." 
                        value={input} 
                        onChange={ (e) => setInput(e.target.value)} />

                    <Button variant="primary" onClick={handleSend} className="ms-2">Send</Button>
                </Form.Group>
            </Form>
        </Container>
        
      </>
    );
  };
  
  export default UserChatPage;
  