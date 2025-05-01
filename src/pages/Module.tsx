
import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';

interface VideoContent {
  title: string;
  url: string;
  description: string;
  duration: string;
}

interface ReadingContent {
  title: string;
  content: string[];
}

const Module = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'video';
  const navigate = useNavigate();
  
  // Sample video content
  const videoContent: VideoContent = {
    title: "Introduction to Mathematics",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example video
    description: "This video introduces the fundamental concepts of mathematics that you'll need throughout this course.",
    duration: "10:30"
  };
  
  // Sample reading content
  const readingContent: ReadingContent = {
    title: "Basic Programming Concepts",
    content: [
      "Programming is the process of creating instructions that tell a computer how to perform a task.",
      "Variables are containers for storing data values. In most programming languages, you need to declare a variable before you can use it.",
      "Functions are blocks of code designed to perform a particular task. They are executed when they are called.",
      "Conditionals allow you to make decisions in your code. The most common form is the if statement."
    ]
  };
  
  const renderModuleContent = () => {
    switch(type) {
      case 'video':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">{videoContent.title}</h1>
            <div className="aspect-video bg-duolingo-gray rounded-lg overflow-hidden mb-4">
              <iframe 
                className="w-full h-full"
                src={videoContent.url} 
                title={videoContent.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="text-sm text-duolingo-dark/70 mb-4">Duration: {videoContent.duration}</div>
            <p className="mb-6">{videoContent.description}</p>
            <div className="flex justify-between">
              <button onClick={() => navigate(-1)} className="duo-btn-outline">
                Back to Lessons
              </button>
              <button onClick={() => navigate('/')} className="duo-btn">
                Complete & Continue
              </button>
            </div>
          </div>
        );
        
      case 'reading':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">{readingContent.title}</h1>
            <div className="space-y-4 mb-8">
              {readingContent.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => navigate(-1)} className="duo-btn-outline">
                Back to Lessons
              </button>
              <button onClick={() => navigate('/')} className="duo-btn">
                Complete & Continue
              </button>
            </div>
          </div>
        );
        
      case 'practice':
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Practice Session</h1>
            <div className="bg-duolingo-light p-6 rounded-lg mb-8">
              <h2 className="font-bold mb-4">Exercise: Apply what you've learned</h2>
              <p className="mb-6">Complete the following exercises to practice the concepts covered in this module.</p>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-duolingo-gray">
                  <p className="font-medium">Exercise 1: Solve the problem using the technique demonstrated.</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-duolingo-gray">
                  <p className="font-medium">Exercise 2: Explain the underlying principles in your own words.</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-duolingo-gray">
                  <p className="font-medium">Exercise 3: Apply the concept to a new situation.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => navigate(-1)} className="duo-btn-outline">
                Back to Lessons
              </button>
              <button onClick={() => navigate('/')} className="duo-btn">
                Complete & Continue
              </button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Module Content</h1>
            <p>This module type is not yet available.</p>
            <button onClick={() => navigate(-1)} className="duo-btn mt-4">
              Back to Lessons
            </button>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-duolingo-light">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {renderModuleContent()}
        </div>
      </div>
    </div>
  );
};

export default Module;
