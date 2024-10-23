import React, { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axios from "axios"; // Axios for API requests

function Chatbot() {
  /* eslint-disable prettier/prettier */
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);  

  // Auto-scroll to the bottom when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      // Append user message to the chat
      const userMessage = { text: input, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
  
      // Send user input to Flask backend and get bot's response
      try {
        const response = await axios.post("http://localhost:5000/chatbot", { message: input });
  
        // Accessing bot's response data
        const filteredData = response.data.filtered_data_preview;
  
        // Format the filtered data to display in a readable manner
        const formattedData = filteredData.map(item => JSON.stringify(item, null, 2)).join("\n");
  
        // Create bot response with both message and data preview
        const botResponse = { text: `${response.data.message}\nData Preview:\n${formattedData}`, sender: "bot" };
  
        // Append bot response to the chat
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } catch (error) {
        console.error("Error fetching bot response:", error);
      }
  
      // Clear input after sending
      setInput("");
    }
  };
  

  return (
    <DashboardLayout>
      <DashboardNavbar absolute isMini />
      <MDBox display="flex" flexDirection="column" justifyContent="space-between" height="85vh" mt={8} px={2}>
        {/* Chat messages */}
        <MDBox flex={1} style={{ border: "1px solid #ccc", padding: "10px", overflowY: "scroll", borderRadius: "8px" }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start", marginBottom: "10px" }}>
              <div
                style={{
                  maxWidth: "60%",
                  padding: "10px",
                  borderRadius: "15px",
                  backgroundColor: msg.sender === "user" ? "#0084ff" : "#e4e6eb",
                  color: msg.sender === "user" ? "#fff" : "#000",
                  textAlign: "left",
                  wordBreak: "break-word",
                }}
              >
                <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </MDBox>

        {/* Input field and Send button */}
        <MDBox mt={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
              <TextField
                fullWidth
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSend();
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button fullWidth variant="contained" color="primary" onClick={handleSend}>
                Send
              </Button>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Chatbot;
