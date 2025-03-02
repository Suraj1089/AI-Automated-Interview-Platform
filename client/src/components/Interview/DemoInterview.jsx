import React, { useState, useEffect, useRef } from 'react';
import Evaluation from '../Evaluation/Evaluation';
import { useNavigate } from 'react-router-dom';

const INTERVIEWERS = [
  {
    name: 'Suraj',
    email: 'suraj@gmail.com',
    provider: 'openai',
  },
  {
    name: 'John',
    email: 'john@gmail.com',
    provider: 'gemini',
  },
  {
    name: 'Sara',
    email: 'sara@gmail.com',
    provider: 'claude',
  },
  {
    name: 'Alina',
    email: 'alina@gmail.com',
    provider: 'deepseek',
  },
];
const DemoInterview = () => {

  const navigate = useNavigate();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(32); // 32 seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false)

  const videoRef = useRef(null);
  const audioStreamRef = useRef(null);
  const videoStreamRef = useRef(null);

  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewCompleted, setInterviewCompleted] = useState(false);

  // Select a random interviewer when the component loads
  const [interviewer, setInterviewer] = useState(null);

  const isInterviewInProgress = interviewStarted && !interviewCompleted;

  const showEvaluation = interviewCompleted && !isInterviewInProgress;

  const handleOnEvaluationClose = () => {
    setIsModelOpen(false)
    navigate("/")
  }

  const handleInterviewStartButtonClick = (event) => {
    if (event.target.innerText === 'Start Interview') {
      setInterviewStarted(true);
      setIsTimerRunning(true);
    } else {
      if (window.confirm('Are you sure you want to exit?')) {
        setInterviewCompleted(true);
        setIsModelOpen(true)
      }
    }
  };

  useEffect(() => {
    const randomInterviewer =
      INTERVIEWERS[Math.floor(Math.random() * INTERVIEWERS.length)];
    setInterviewer(randomInterviewer);
  }, []);

  const demoQuestions = [
    'Tell me about your experience with React development.',
    'How do you handle state management in large applications?',
    "Can you explain a challenging problem you've solved recently?",
    "What's your approach to writing clean and maintainable code?",
  ];

  const checkPermissions = async (type) => {
    try {
      const result = await navigator.permissions.query({ name: type });
      return result.state;
    } catch (err) {
      console.warn(`Could not check ${type} permission:`, err);
      return 'prompt';
    }
  };

  // Function to access microphone
  const startAudioStream = async () => {
    const micPermission = await checkPermissions('microphone');
    if (micPermission === 'denied') {
      setIsMuted(true);
      alert('Microphone access denied. Please enable it in browser settings.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  // Function to access camera (optional)
  const startVideoStream = async () => {
    const cameraPermission = await checkPermissions('camera');
    if (cameraPermission === 'denied') {
      setIsVideoOff(true);
      alert('Camera access denied. Please enable it in browser settings.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      videoStreamRef.current = stream;
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopAudioStream = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
  };

  const stopVideoStream = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach((track) => track.stop());
      videoStreamRef.current = null;
    }
  };

  useEffect(() => {
    if (!isVideoOff) {
      startVideoStream();
    } else {
      stopVideoStream();
    }
  }, [isVideoOff]);

  useEffect(() => {
    if (!isMuted) {
      startAudioStream();
    } else {
      stopAudioStream();
    }
  }, [isMuted]);

  // Timer Effect
  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Auto-move to next question when time is up
      handleNextQuestion();
    }
    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (currentQuestion < demoQuestions.length - 1) {
      setCurrentQuestion((curr) => curr + 1);
      setTimeLeft(32); // Reset timer for new question
      setIsTimerRunning(true);
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: '500',
    transition: 'background-color 0.3s',
  };

  const iconButtonStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    margin: '10px 0',
    display: 'hidden',
  };

  // Timer component
  const TimerDisplay = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px',
      }}
    >
      <div
        style={{
          padding: '8px 12px',
          borderRadius: '5px',
          backgroundColor: timeLeft <= 30 ? '#dc3545' : '#28a745',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px',
        }}
      >
        {formatTime(timeLeft)}
      </div>
    </div>
  );

  // SVG icons (same as before)
  const MicIcon = ({ muted }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {muted ? (
        <>
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path>
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </>
      ) : (
        <>
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </>
      )}
    </svg>
  );

  const VideoIcon = ({ off }) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {off ? (
        <>
          <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </>
      ) : (
        <>
          <path d="M23 7l-7 5 7 5V7z"></path>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </>
      )}
    </svg>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f0f0f0',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Video Feed Section */}
        <div style={cardStyle}>
          <div
            style={{
              aspectRatio: '16/9',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isVideoOff ? (
              <div style={{ color: 'white', textAlign: 'center' }}>
                <VideoIcon off={true} />
                <p style={{ marginTop: '10px' }}>Camera is off</p>
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#2a2a2a',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ width: '75%', borderRadius: '2px' }}
                />
              </div>
            )}
          </div>

          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}
          >
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                ...iconButtonStyle,
                backgroundColor: isMuted ? '#dc3545' : '#6c757d',
                color: 'white',
              }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              <MicIcon muted={isMuted} />
            </button>
            <button
              onClick={() => setIsVideoOff(!isVideoOff)}
              style={{
                ...iconButtonStyle,
                backgroundColor: isVideoOff ? '#dc3545' : '#6c757d',
                color: 'white',
              }}
              title={isVideoOff ? 'Start Video' : 'Stop Video'}
            >
              <VideoIcon off={isVideoOff} />
            </button>
          </div>
        </div>

        {/* Interview Section */}
        <div style={cardStyle}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <button
                onClick={handleInterviewStartButtonClick}
                style={{
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  border: 'none',
                  backgroundColor: isInterviewInProgress
                    ? '#f11414'
                    : '#007bff',
                  color: 'white',
                  fontWeight: '500',
                  transition: 'background-color 0.3s',
                }}
              >
                {isInterviewInProgress ? 'Exit Interview' : 'Start Interview'}
              </button>
              {interviewer && (!interviewStarted || !isInterviewInProgress) && (
                <div style={{ marginTop: '50px', textAlign: 'center' }}>
                  <h3>Interviewer: {interviewer.name}</h3>
                  <p>Provider: {interviewer.provider}</p>
                  <p>Email: {interviewer.email}</p>
                </div>
              )}
            </div>
            {isInterviewInProgress && (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#28a745',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite',
                  }}
                ></div>
                <span style={{ color: '#666' }}>
                  {interviewer.name} is listening...
                </span>
              </div>
            )}
          </div>

          {isInterviewInProgress && <TimerDisplay />}
          {isInterviewInProgress && (
            <>
              <div
                style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px',
                  minHeight: '150px',
                }}
              >
                <p style={{ fontWeight: '600', marginBottom: '10px' }}>
                  Current Question:
                </p>
                <p style={{ color: '#333' }}>
                  {demoQuestions[currentQuestion]}
                </p>
              </div>
              <div>
                <button
                  onClick={handleNextQuestion}
                  style={{
                    ...buttonStyle,
                    width: '100%',
                    marginBottom: '10px',
                  }}
                >
                  Next Question
                </button>
                <p
                  style={{
                    textAlign: 'center',
                    color: '#666',
                    fontSize: '14px',
                  }}
                >
                  Question {currentQuestion + 1} of {demoQuestions.length}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          ...cardStyle,
          maxWidth: '1200px',
          margin: '20px auto',
        }}
      >
        {!isInterviewInProgress && (
          <div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '15px',
              }}
            >
              Interview Tips
            </h3>
            <ul style={{ color: '#444' }}>
              <li style={{ marginBottom: '8px' }}>
                • Speak clearly and maintain good eye contact with the camera
              </li>
              <li style={{ marginBottom: '8px' }}>
                • Take a moment to gather your thoughts before answering
              </li>
              <li style={{ marginBottom: '8px' }}>
                • Provide specific examples to support your answers
              </li>
              <li style={{ marginBottom: '8px' }}>
                • Keep your responses focused and concise
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* evaluation model */}
      {isModelOpen && <Evaluation evaluationData={"some data to be displayed\nhow I can modify this"} onClose={handleOnEvaluationClose}/>}
    </div>
  );
};

export default DemoInterview;
