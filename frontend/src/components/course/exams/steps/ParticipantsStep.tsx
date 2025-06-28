'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Search, UserPlus, Mail, Phone } from "lucide-react";
import { Participant } from '@/types/courseExam';

interface ParticipantsStepProps {
  onAutoSave: () => void;
}

export const ParticipantsStep: React.FC<ParticipantsStepProps> = ({ onAutoSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);

  const mockParticipants: Participant[] = [
    { id: '1', name: 'احمد محمدی', email: 'ahmad@example.com', role: 'student', phone: '09121234567' },
    { id: '2', name: 'فاطمه احمدی', email: 'fateme@example.com', role: 'student', phone: '09127654321' },
    { id: '3', name: 'علی رضایی', email: 'ali@example.com', role: 'instructor', phone: '09123456789' },
    { id: '4', name: 'مریم کریمی', email: 'maryam@example.com', role: 'student', phone: '09129876543' },
  ];

  const filteredParticipants = mockParticipants.filter(p =>
    p.name.includes(searchTerm) || p.email.includes(searchTerm)
  );

  const addParticipant = (participant: Participant) => {
    if (!selectedParticipants.find(p => p.id === participant.id)) {
      setSelectedParticipants([...selectedParticipants, participant]);
      onAutoSave();
    }
  };

  const removeParticipant = (participantId: string) => {
    setSelectedParticipants(selectedParticipants.filter(p => p.id !== participantId));
    onAutoSave();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">انتخاب شرکت‌کنندگان</h3>
        <p className="text-blue-700">فراگیران و مدرسان مورد نظر را برای آزمون انتخاب کنید</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search and Add Section */}
        <Card className="border border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Search className="w-5 h-5" />
              جستجو و افزودن
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="جستجو بر اساس نام یا ایمیل..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right border-slate-300 focus:border-blue-500"
              />
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {filteredParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                        {participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-slate-800">{participant.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-3 h-3" />
                        {participant.email}
                      </div>
                      {participant.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-3 h-3" />
                          {participant.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={participant.role === 'instructor' ? 'default' : 'secondary'}>
                      {participant.role === 'instructor' ? 'مدرس' : 'فراگیر'}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => addParticipant(participant)}
                      disabled={selectedParticipants.some(p => p.id === participant.id)}
                    >
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Participants */}
        <Card className="border border-blue-200/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Users className="w-5 h-5" />
              شرکت‌کنندگان انتخاب شده ({selectedParticipants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedParticipants.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <p>هنوز هیچ شرکت‌کننده‌ای انتخاب نشده است</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {selectedParticipants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback className="bg-blue-200 text-blue-800 font-semibold">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-slate-800">{participant.name}</h4>
                        <p className="text-sm text-slate-600">{participant.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={participant.role === 'instructor' ? 'default' : 'secondary'}>
                        {participant.role === 'instructor' ? 'مدرس' : 'فراگیر'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeParticipant(participant.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card className="border border-green-200/50 bg-green-50/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {selectedParticipants.filter(p => p.role === 'student').length}
                </div>
                <div className="text-sm text-green-600">فراگیر</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {selectedParticipants.filter(p => p.role === 'instructor').length}
                </div>
                <div className="text-sm text-blue-600">مدرس</div>
              </div>
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold text-slate-700">
                {selectedParticipants.length}
              </div>
              <div className="text-sm text-slate-600">کل شرکت‌کنندگان</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 