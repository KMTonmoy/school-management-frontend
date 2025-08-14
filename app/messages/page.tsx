"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FiSend, FiX, FiUser, FiUsers, FiUserPlus } from "react-icons/fi";
import toast from "react-hot-toast";
import { Label } from "@/components/label";
import { useAuthRedirect } from "@/Hooks/useAuthRedirect";

type Student = {
  id: number;
  name: string;
  phone: string;
  guardians: Guardian[];
};

type Guardian = {
  name: string;
  phone: string;
  relation: string;
};

const Messages = () => {
  // Mock data - replace with actual API calls
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "John Doe",
      phone: "+1234567890",
      guardians: [
        { name: "Jane Doe", phone: "+1987654321", relation: "Mother" },
      ],
    },
    {
      id: 2,
      name: "Alice Smith",
      phone: "+1122334455",
      guardians: [
        { name: "Bob Smith", phone: "+1555666777", relation: "Father" },
      ],
    },
    {
      id: 3,
      name: "Michael Johnson",
      phone: "+1444333222",
      guardians: [
        { name: "Sarah Johnson", phone: "+1777888999", relation: "Mother" },
        { name: "David Johnson", phone: "+1666555444", relation: "Father" },
      ],
    },
  ]);

  const [selectedRecipientType, setSelectedRecipientType] = useState("student");
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [selectedGuardians, setSelectedGuardians] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [openGuardianSheet, setOpenGuardianSheet] = useState(false);

  const MAX_SMS_LENGTH = 160;

  useEffect(() => {
    setCharCount(message.length);
  }, [message]);

  const handleRecipientTypeChange = (value: string) => {
    setSelectedRecipientType(value);
    // Clear selections when changing type
    setSelectedStudents([]);
    setSelectedGuardians([]);
  };

  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleGuardianSelection = (guardianPhone: string) => {
    setSelectedGuardians((prev) =>
      prev.includes(guardianPhone)
        ? prev.filter((phone) => phone !== guardianPhone)
        : [...prev, guardianPhone]
    );
  };

  const handleSendMessage = () => {
    if (
      (selectedRecipientType === "student" && selectedStudents.length === 0) ||
      (selectedRecipientType === "guardian" &&
        selectedGuardians.length === 0) ||
      (selectedRecipientType === "bulk" &&
        selectedStudents.length === 0 &&
        selectedGuardians.length === 0)
    ) {
      toast.error("Please select at least one recipient");
      return;
    }

    if (message.trim() === "") {
      toast.error("Message cannot be empty");
      return;
    }

    // Determine recipients based on selection
    let recipients: { name: string; phone: string; type: string }[] = [];

    if (selectedRecipientType === "student") {
      recipients = students
        .filter((student) => selectedStudents.includes(student.id))
        .map((student) => ({
          name: student.name,
          phone: student.phone,
          type: "student",
        }));
    } else if (selectedRecipientType === "guardian") {
      // Get all guardians from selected students
      recipients = students
        .filter((student) => selectedStudents.includes(student.id))
        .flatMap((student) => student.guardians)
        .filter((guardian) => selectedGuardians.includes(guardian.phone))
        .map((guardian) => ({
          name: guardian.name,
          phone: guardian.phone,
          type: "guardian",
        }));
    } else if (selectedRecipientType === "bulk") {
      // For bulk, send to all selected students and optionally their guardians
      const studentRecipients = students
        .filter((student) => selectedStudents.includes(student.id))
        .map((student) => ({
          name: student.name,
          phone: student.phone,
          type: "student",
        }));

      const guardianRecipients = students
        .filter((student) => selectedStudents.includes(student.id))
        .flatMap((student) => student.guardians)
        .filter((guardian) => selectedGuardians.includes(guardian.phone))
        .map((guardian) => ({
          name: guardian.name,
          phone: guardian.phone,
          type: "guardian",
        }));

      recipients = [...studentRecipients, ...guardianRecipients];
    }

    // Here you would typically call an API to send the SMS
    console.log("Sending message to:", recipients);
    console.log("Message:", message);

    // Mock API call success
    toast.success(`Message sent to ${recipients.length} recipient(s)`);

    // Reset form
    setMessage("");
    setSelectedStudents([]);
    setSelectedGuardians([]);
  };

  const handleClear = () => {
    setMessage("");
    setSelectedStudents([]);
    setSelectedGuardians([]);
  };

  useAuthRedirect();

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Send Messages</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipient-type">Recipient Type</Label>
            <Select
              value={selectedRecipientType}
              onValueChange={handleRecipientTypeChange}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select recipient type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">
                  <div className="flex items-center">
                    <FiUser className="mr-2 h-4 w-4" />
                    Individual Students
                  </div>
                </SelectItem>
                <SelectItem value="guardian">
                  <div className="flex items-center">
                    <FiUserPlus className="mr-2 h-4 w-4" />
                    Guardians Only
                  </div>
                </SelectItem>
                <SelectItem value="bulk">
                  <div className="flex items-center">
                    <FiUsers className="mr-2 h-4 w-4" />
                    Bulk SMS (Students and/or Guardians)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Select{" "}
              {selectedRecipientType === "guardian" ? "Guardians" : "Students"}
            </Label>

            <Command className="rounded-lg border shadow-md">
              <CommandInput placeholder="Search students..." />
              <CommandList>
                <CommandEmpty>No students found.</CommandEmpty>
                <CommandGroup>
                  {students.map((student) => (
                    <div key={student.id} className="space-y-1">
                      <CommandItem className="p-0">
                        <div className="flex items-center w-full p-2">
                          <Checkbox
                            id={`student-${student.id}`}
                            checked={selectedStudents.includes(student.id)}
                            onCheckedChange={() =>
                              toggleStudentSelection(student.id)
                            }
                            disabled={
                              selectedRecipientType === "guardian" &&
                              student.guardians.length === 0
                            }
                            className="mr-2"
                          />
                          <Label
                            htmlFor={`student-${student.id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div>{student.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Phone: {student.phone}
                            </div>
                          </Label>

                          {selectedRecipientType !== "student" &&
                            student.guardians.length > 0 && (
                              <Sheet
                                open={openGuardianSheet}
                                onOpenChange={setOpenGuardianSheet}
                              >
                                <SheetTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      if (
                                        !selectedStudents.includes(student.id)
                                      ) {
                                        toggleStudentSelection(student.id);
                                      }
                                    }}
                                  >
                                    <FiUserPlus className="h-4 w-4" />
                                  </Button>
                                </SheetTrigger>
                                <SheetContent
                                  side="right"
                                  className="w-[400px]"
                                >
                                  <SheetHeader>
                                    <SheetTitle>
                                      {student.name}'s Guardians
                                    </SheetTitle>
                                  </SheetHeader>
                                  <div className="space-y-2 py-4">
                                    {student.guardians.map((guardian) => (
                                      <div
                                        key={guardian.phone}
                                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded"
                                      >
                                        <Checkbox
                                          id={`guardian-${guardian.phone}`}
                                          checked={selectedGuardians.includes(
                                            guardian.phone
                                          )}
                                          onCheckedChange={() =>
                                            toggleGuardianSelection(
                                              guardian.phone
                                            )
                                          }
                                        />
                                        <Label
                                          htmlFor={`guardian-${guardian.phone}`}
                                          className="flex-1 cursor-pointer"
                                        >
                                          <div>
                                            {guardian.name} ({guardian.relation}
                                            )
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            Phone: {guardian.phone}
                                          </div>
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </SheetContent>
                              </Sheet>
                            )}
                        </div>
                      </CommandItem>
                    </div>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MAX_SMS_LENGTH}
              placeholder="Type your message here..."
            />
            <div
              className={`text-sm ${
                charCount > MAX_SMS_LENGTH
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {charCount}/{MAX_SMS_LENGTH} characters
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClear}>
            <FiX className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={
              (selectedRecipientType === "student" &&
                selectedStudents.length === 0) ||
              (selectedRecipientType === "guardian" &&
                selectedGuardians.length === 0) ||
              (selectedRecipientType === "bulk" &&
                selectedStudents.length === 0 &&
                selectedGuardians.length === 0) ||
              message.trim() === ""
            }
          >
            <FiSend className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Messages;
