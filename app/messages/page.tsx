'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, Form, Input, Select, message } from 'antd';

const { Option } = Select;

interface Student {
  _id: string;
  name: string;
  guardian: {
    primaryContact: string;
  };
}

interface SMSFormValues {
  studentId: string;
  messageType: 'progress' | 'warning' | 'critical';
  customMessage?: string;
}

const MessageToParent = () => {
  const [form] = Form.useForm();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('https://sl-backend-nine.vercel.app/api/students', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setStudents(response.data);
    } catch (error) {
      message.error('Failed to fetch students');
    }
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Remove leading 0 if present and add +880
    const normalizedNumber = digits.startsWith('0') ? digits.substring(1) : digits;
    
    // Validate the number is 10 digits (without country code)
    if (normalizedNumber.length !== 10) {
      throw new Error('Bangladeshi phone numbers must be 10 digits (excluding country code)');
    }
    
    return `+880${normalizedNumber}`;
  };

  const onFinish = async (values: SMSFormValues) => {
    setLoading(true);
    try {
      const student = students.find(s => s._id === values.studentId);
      if (!student) throw new Error('Student not found');
      
      const formattedValues = {
        ...values,
        to: formatPhoneNumber(student.guardian.primaryContact)
      };

      await axios.post('https://sl-backend-nine.vercel.app/api/progress-alert', formattedValues, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      message.success('Message sent successfully!');
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <Card title="Send Message to Parent/Guardian" style={{ maxWidth: 600, margin: '20px auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="studentId"
          label="Select Student"
          rules={[{ required: true, message: 'Please select a student' }]}
        >
          <Select placeholder="Select a student" showSearch optionFilterProp="children">
            {students.map(student => (
              <Option key={student._id} value={student._id}>
                {student.name} ({student.guardian.primaryContact})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="messageType"
          label="Message Type"
          rules={[{ required: true, message: 'Please select a message type' }]}
        >
          <Select placeholder="Select message type">
            <Option value="progress">Progress Update</Option>
            <Option value="warning">Warning</Option>
            <Option value="critical">Critical Alert</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="customMessage"
          label="Custom Message (Optional)"
        >
          <Input.TextArea rows={4} placeholder="Enter custom message here..." />
        </Form.Item>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            style={{ backgroundColor: '#282523', borderColor: '#282523' }}
          >
            Send Message
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default MessageToParent;