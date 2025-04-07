import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from '../components/ChatInput';
import userEvent from '@testing-library/user-event';

describe('ChatInput', () => {
  it('renders correctly', () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    expect(screen.getByPlaceholderText('输入消息...')).toBeInTheDocument();
    expect(screen.getByText('发送')).toBeInTheDocument();
  });

  it('calls onSendMessage when form is submitted', () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('输入消息...');
    const button = screen.getByText('发送');
    
    fireEvent.change(input, { target: { value: '测试消息' } });
    fireEvent.click(button);
    
    expect(mockSendMessage).toHaveBeenCalledWith('测试消息');
    expect(input).toHaveValue('');
  });

  it('does not call onSendMessage when message is empty', () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const button = screen.getByText('发送');
    fireEvent.click(button);
    
    expect(mockSendMessage).not.toHaveBeenCalled();
  });

  it('handles Enter key press to submit message', async () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('输入消息...');
    await userEvent.type(input, '测试消息{enter}');
    
    expect(mockSendMessage).toHaveBeenCalledWith('测试消息');
    expect(input).toHaveValue('');
  });

  it('trims whitespace from message before sending', () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('输入消息...');
    const button = screen.getByText('发送');
    
    fireEvent.change(input, { target: { value: '  测试消息  ' } });
    fireEvent.click(button);
    
    expect(mockSendMessage).toHaveBeenCalledWith('测试消息');
  });

  it('maintains input state while typing', () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('输入消息...');
    
    fireEvent.change(input, { target: { value: '测' } });
    expect(input).toHaveValue('测');
    
    fireEvent.change(input, { target: { value: '测试' } });
    expect(input).toHaveValue('测试');
    
    fireEvent.change(input, { target: { value: '测试消' } });
    expect(input).toHaveValue('测试消');
  });

  it('handles consecutive message submissions', () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('输入消息...');
    const button = screen.getByText('发送');
    
    // 第一条消息
    fireEvent.change(input, { target: { value: '消息1' } });
    fireEvent.click(button);
    expect(mockSendMessage).toHaveBeenCalledWith('消息1');
    expect(input).toHaveValue('');
    
    // 第二条消息
    fireEvent.change(input, { target: { value: '消息2' } });
    fireEvent.click(button);
    expect(mockSendMessage).toHaveBeenCalledWith('消息2');
    expect(input).toHaveValue('');
  });

  it('handles special characters correctly', () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('输入消息...');
    const button = screen.getByText('发送');
    
    const specialMessage = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    fireEvent.change(input, { target: { value: specialMessage } });
    fireEvent.click(button);
    
    expect(mockSendMessage).toHaveBeenCalledWith(specialMessage);
    expect(input).toHaveValue('');
  });

  it('handles emoji input correctly', () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('输入消息...');
    const button = screen.getByText('发送');
    
    const messageWithEmoji = '你好👋世界🌍！';
    fireEvent.change(input, { target: { value: messageWithEmoji } });
    fireEvent.click(button);
    
    expect(mockSendMessage).toHaveBeenCalledWith(messageWithEmoji);
    expect(input).toHaveValue('');
  });

  it('handles very long messages', () => {
    const mockSendMessage = jest.fn();
    render(<ChatInput onSendMessage={mockSendMessage} />);
    
    const input = screen.getByPlaceholderText('输入消息...');
    const button = screen.getByText('发送');
    
    const longMessage = '测试'.repeat(1000);
    fireEvent.change(input, { target: { value: longMessage } });
    fireEvent.click(button);
    
    expect(mockSendMessage).toHaveBeenCalledWith(longMessage);
    expect(input).toHaveValue('');
  });
});