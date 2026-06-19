import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Input, Tabs, Spin, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AgentCard from './components/AgentCard';
import { getAllAgents } from '../../shared/api/aiAssistant';
import { AIAgent, AgentCategory, CATEGORY_METADATA } from '../../modules/aiAssistant';
import styles from './AIAssistantSubmodule.module.css';

const { Search } = Input;
const { TabPane } = Tabs;

const AIAssistantSubmodule: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State management
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);

  // Get initial values from URL params
  const initialTab = searchParams.get('tab') || 'all';
  const initialAgent = searchParams.get('agent');
  const [activeCategory, setActiveCategory] = useState<string>(initialTab);

  // Load agents on component mount
  useEffect(() => {
    loadAgents();
  }, []);

  // Debounce search input (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Expand agent from URL parameter
  useEffect(() => {
    if (initialAgent && agents.length > 0) {
      const agentExists = agents.some(agent => agent.id === initialAgent);
      if (agentExists) {
        setExpandedAgentId(initialAgent);
      }
    }
  }, [initialAgent, agents]);

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (activeCategory !== 'all') {
      params.set('tab', activeCategory);
    } else {
      params.delete('tab');
    }
    setSearchParams(params, { replace: true });
  }, [activeCategory]);

  // Update URL when agent is expanded
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (expandedAgentId) {
      params.set('agent', expandedAgentId);
    } else {
      params.delete('agent');
    }
    setSearchParams(params, { replace: true });
  }, [expandedAgentId]);

  /**
   * Fetch all agents from API
   */
  const loadAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllAgents();
      setAgents(data);
    } catch (err) {
      console.error('Error loading agents:', err);
      setError('Failed to load AI agents. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Group agents by category
   */
  const agentsByCategory = useMemo(() => {
    const grouped: Record<string, AIAgent[]> = {};

    agents.forEach(agent => {
      const category = agent.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(agent);
    });

    return grouped;
  }, [agents]);

  /**
   * Filter agents based on search query
   */
  const filteredAgents = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return agents;
    }

    const query = debouncedSearch.toLowerCase();
    return agents.filter(agent => {
      const matchesName = agent.name.toLowerCase().includes(query);
      const matchesDescription = agent.description.toLowerCase().includes(query);
      const matchesCategory = CATEGORY_METADATA[agent.category].label.toLowerCase().includes(query);

      return matchesName || matchesDescription || matchesCategory;
    });
  }, [agents, debouncedSearch]);

  /**
   * Get agents for current tab (category filter + search)
   */
  const displayedAgents = useMemo(() => {
    let result = filteredAgents;

    if (activeCategory !== 'all') {
      result = result.filter(agent => agent.category === activeCategory);
    }

    return result;
  }, [filteredAgents, activeCategory]);

  /**
   * Handle search input change
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  /**
   * Handle tab change
   */
  const handleTabChange = (key: string) => {
    setActiveCategory(key);
    setExpandedAgentId(null); // Collapse any expanded agent when switching tabs
  };

  /**
   * Handle agent card expand/collapse
   * Only one agent can be expanded at a time
   */
  const handleToggleExpand = (agentId: string) => {
    setExpandedAgentId(prevId => (prevId === agentId ? null : agentId));
  };

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Loading AI Assistants..." />
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <button onClick={loadAgents} className={styles.retryButton}>
              Retry
            </button>
          }
        />
      </div>
    );
  }

  /**
   * Get count of agents per category
   */
  const getCategoryCount = (category: string): number => {
    if (category === 'all') {
      return agents.length;
    }
    return agentsByCategory[category]?.length || 0;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Assistant Configuration</h1>
        <p className={styles.subtitle}>
          Configure and manage your AI assistants to automate procurement tasks
        </p>
      </div>

      <div className={styles.searchBar}>
        <Search
          placeholder="Search agents by name, description, or category..."
          value={searchQuery}
          onChange={handleSearchChange}
          prefix={<SearchOutlined />}
          size="large"
          allowClear
        />
      </div>

      <Tabs
        activeKey={activeCategory}
        onChange={handleTabChange}
        className={styles.tabs}
        type="card"
      >
        <TabPane
          tab={`All (${getCategoryCount('all')})`}
          key="all"
        />
        {Object.values(AgentCategory).map(category => (
          <TabPane
            tab={
              <span>
                {CATEGORY_METADATA[category].icon} {CATEGORY_METADATA[category].label} ({getCategoryCount(category)})
              </span>
            }
            key={category}
          />
        ))}
      </Tabs>

      <div className={styles.agentList}>
        {displayedAgents.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No agents found matching your search criteria.</p>
            {debouncedSearch && (
              <button
                onClick={() => setSearchQuery('')}
                className={styles.clearSearchButton}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          displayedAgents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              expanded={expandedAgentId === agent.id}
              onToggleExpand={() => handleToggleExpand(agent.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AIAssistantSubmodule;
