import { render, screen, fireEvent } from '@testing-library/react'
import { IntegrationCard } from '@/components/integrations/integration-card'
import { IconPhone } from '@tabler/icons-react'

const mockProps = {
  title: 'VAPI Voice Assistant',
  description: 'AI-powered voice calling system',
  icon: <IconPhone className="h-5 w-5" />,
  isConfigured: true,
  isMinimized: false,
  onToggleMinimize: jest.fn(),
  onConfigure: jest.fn(),
  onTest: jest.fn(),
  isTesting: false,
  lastTested: '2025-08-15T10:00:00Z',
}

describe('IntegrationCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders integration information correctly', () => {
    render(<IntegrationCard {...mockProps} />)
    
    expect(screen.getByText('VAPI Voice Assistant')).toBeInTheDocument()
    expect(screen.getByText('AI-powered voice calling system')).toBeInTheDocument()
    expect(screen.getByText('Configure')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('calls onConfigure when configure button is clicked', () => {
    render(<IntegrationCard {...mockProps} />)
    
    const configureButton = screen.getByText('Configure')
    fireEvent.click(configureButton)
    
    expect(mockProps.onConfigure).toHaveBeenCalledTimes(1)
  })

  it('calls onTest when test button is clicked', () => {
    render(<IntegrationCard {...mockProps} />)
    
    const testButton = screen.getByText('Test')
    fireEvent.click(testButton)
    
    expect(mockProps.onTest).toHaveBeenCalledTimes(1)
  })

  it('shows minimized state correctly', () => {
    render(<IntegrationCard {...mockProps} isMinimized={true} />)
    
    expect(screen.queryByText('AI-powered voice calling system')).not.toBeInTheDocument()
    expect(screen.getByText('VAPI Voice Assistant')).toBeInTheDocument()
  })

  it('shows testing state correctly', () => {
    render(<IntegrationCard {...mockProps} isTesting={true} />)
    
    expect(screen.getByText('Testing...')).toBeInTheDocument()
    expect(screen.getByText('Test')).toBeDisabled()
  })

  it('calls onToggleMinimize when toggle button is clicked', () => {
    render(<IntegrationCard {...mockProps} />)
    
    const toggleButton = screen.getByRole('button', { name: /toggle/i })
    fireEvent.click(toggleButton)
    
    expect(mockProps.onToggleMinimize).toHaveBeenCalledTimes(1)
  })
})
