import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Home, MapPin, DollarSign, ArrowUpRight, Bot, User } from 'lucide-react';
import { extractSearchParameters } from '../../utils/openRouter';
import { getAllCollectionsData, filterProperties, translateRegionsToEnglish } from '../../utils/data';
import ViewMoreLink from '../ViewMoreLink';

const Chat = () => {
  const [messages, setMessages] = useState([{ text: "Welcome to your premium property concierge. I'm here to help you discover exceptional properties tailored to your vision.", sender: 'ai' }]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const [currentSearchContext, setCurrentSearchContext] = useState({});
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAiThinking, setIsAiThinking] = useState(false);

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    try {
      const data = await getAllCollectionsData();
      setAllProperties(data);
    } catch (err) {
      console.error("Error fetching initial properties:", err);
      setMessages(prev => [...prev, { text: "Sorry, I'm having trouble loading property data right now.", sender: 'ai' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiThinking]);

  const handleSend = async () => {
    if (!input.trim() || loading || isAiThinking) return;

    const userMessage = { text: input, sender: 'user' };
    const newMessagesForApi = [...messages, userMessage];
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsAiThinking(true);

    const aiResponse = await extractSearchParameters(newMessagesForApi);
    let finalMessages = [];

    if (aiResponse.action === 'suggesting') {
      finalMessages.push({ text: aiResponse.response, sender: 'ai' });

    } else if (aiResponse.action === 'searching') {
      let updatedContext = { ...currentSearchContext, ...aiResponse.parameters };
      
      if (updatedContext.region && updatedContext.region.length > 0) {
        console.log("Original regions from AI:", updatedContext.region);
        updatedContext.region = translateRegionsToEnglish(updatedContext.region);
        console.log("Translated regions for filtering:", updatedContext.region);
      }

      setCurrentSearchContext(updatedContext);

      if (aiResponse.response) {
        finalMessages.push({ text: aiResponse.response, sender: 'ai' });
      } else { 
        const filteredResults = filterProperties(allProperties, updatedContext);
        finalMessages.push({ text: `I've found ${filteredResults.length} exceptional properties that match your criteria.`, sender: 'ai' });
        
        // --- MODIFIED: Show up to 6 properties ---
        const propertiesForChat = filteredResults.slice(0, 6); 
        if (propertiesForChat.length > 0) {
          finalMessages.push({ type: 'property_list', sender: 'ai', properties: propertiesForChat });
        }
        
        // --- MODIFIED: Adjust "View More" logic for 6 properties ---
        if (filteredResults.length > 6) { 
          finalMessages.push({ type: 'view_more_link', sender: 'ai', context: updatedContext, total: filteredResults.length });
        }
        
        setCurrentSearchContext({});
      }
    }

    setTimeout(() => {
      setIsAiThinking(false);
      setMessages(prev => [...prev, ...finalMessages]);
    }, 1000);
  };

  const PropertyCard = ({ property }) => {
    const formattedPrice = new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'EGP', 
      maximumFractionDigits: 0 
    }).format(property.price);
    
    const imageUrl = property.images && property.images.length > 0 
      ? property.images[0] 
      : 'https://via.placeholder.com/400x300.png?text=No+Image';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.03 }}
        className="group relative w-64 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-gray-500/10 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative">
          <div className="relative overflow-hidden">
            <img 
              src={imageUrl} 
              alt={property.title.en}
              className="w-full h-36 object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/30">
                {property.category || 'Property'}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="text-white font-bold text-base mb-2 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
              {property.title.en}
            </h3>
            
            <div className="flex items-center gap-2 text-white/70 text-xs mb-3">
              <MapPin className="w-3 h-3" />
              <span>{property.region?.en || 'Location'}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold text-lg">
                  {formattedPrice}
                </span>
              </div>
              
              <motion.a
                href={`/browse/${property.cName}/${property.id}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <ArrowUpRight className="w-4 h-4 text-white" />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const TypingIndicator = () => (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-4"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
        <Bot className="w-6 h-6 text-white" />
      </div>
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl rounded-bl-lg px-6 py-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      </div>
      
      {/* Main Container */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-b border-white/10 backdrop-blur-xl"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Property Concierge</h1>
                <p className="text-white/60 text-sm">Discover exceptional real estate</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">AI Assistant</span>
            </div>
          </div>
        </motion.header>

        {/* Messages */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            <div className="space-y-8">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    {msg.type === 'property_list' ? (
                      <div className="space-y-6">
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                            <Sparkles className="w-4 h-4 text-blue-400" />
                            <span className="text-white/80 text-sm">Properties</span>
                          </div>
                        </div>
                        {/* --- MODIFIED: Container for grid layout --- */}
                        <div className="flex flex-wrap justify-center gap-6">
                          {msg.properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                          ))}
                        </div>
                      </div>
                    ) : msg.type === 'view_more_link' ? (
                      <ViewMoreLink context={msg.context} total={msg.total} />
                    ) : (
                      <div className={`flex items-end gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                          msg.sender === 'user' 
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500' 
                            : 'bg-gradient-to-br from-gray-700 to-gray-900'
                        }`}>
                          {msg.sender === 'user' ? (
                            <User className="w-6 h-6 text-white" />
                          ) : (
                            <Bot className="w-6 h-6 text-white" />
                          )}
                        </div>
                        
                        <div className={`max-w-2xl px-6 py-4 rounded-3xl shadow-xl ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-blue-500/30 rounded-br-lg text-white'
                            : 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-bl-lg text-white'
                        }`}>
                          <p className="leading-relaxed">{msg.text}</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isAiThinking && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </main>

        {/* Input */}
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border-t border-white/10 backdrop-blur-xl"
        >
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
              <div className="relative flex items-center gap-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    disabled={loading || isAiThinking}
                    className="w-full bg-transparent text-white placeholder-white/50 px-4 py-3 rounded-xl focus:outline-none text-lg"
                    placeholder={loading ? "Loading..." : "Describe your dream property..."}
                  />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSend}
                  disabled={!input.trim() || loading || isAiThinking}
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  );
};

export default Chat;