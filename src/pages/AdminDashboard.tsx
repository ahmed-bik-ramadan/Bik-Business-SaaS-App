import React, { useState, useEffect } from 'react';
import { getAllLeads, updateLeadStatus, saveProposal } from '../services/supabase';
import { X, Search, Filter, MessageSquare, Clipboard } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('الكل');
  const [sectorFilter, setSectorFilter] = useState('الكل');
  const [chatFilter, setChatFilter] = useState('الكل');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [proposalModal, setProposalModal] = useState<{lead: any; text: string} | null>(null);

  const fetchLeads = async () => {
    try {
      const data = await getAllLeads();
      setLeads(data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
    const interval = setInterval(fetchLeads, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (leadId: string, status: string) => {
    try {
      await updateLeadStatus(leadId, status);
      setLeads(leads.map(l => l.id === leadId ? { ...l, status } : l));
    } catch (e) {
      console.error("Failed status change:", e);
    }
  };

  const handleSendProposal = async () => {
    if (!proposalModal) return;
    try {
      await saveProposal(proposalModal.lead.id, proposalModal.text);
      await handleStatusChange(proposalModal.lead.id, 'proposal_sent');
      
      const text = encodeURIComponent(proposalModal.text);
      window.open(`https://wa.me/${proposalModal.lead.whatsapp}?text=${text}`, '_blank');
      setProposalModal(null);
    } catch (e) {
      console.error(e);
    }
  };

  const uniqueSectors = Array.from(new Set(leads.map(l => l.sector_l2))).filter(Boolean);

  const filteredLeads = leads.filter(l => {
    const matchSearch = l.company_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        l.user_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'الكل' || l.status === statusFilter;
    const matchSector = sectorFilter === 'الكل' || l.sector_l2 === sectorFilter;
    
    const session = l.diagnostic_sessions?.[0];
    const hasChat = session?.chat_history && Array.isArray(session.chat_history) && session.chat_history.length > 0;
    const matchChat = chatFilter === 'الكل' || 
                      (chatFilter === 'بمحادثة' && hasChat) || 
                      (chatFilter === 'بدون' && !hasChat);

    return matchSearch && matchStatus && matchSector && matchChat;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'proposal_sent': return 'bg-orange-100 text-orange-800';
      case 'negotiating': return 'bg-purple-100 text-purple-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'not_interested': return 'bg-gray-100 text-gray-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getHealthColor = (score: number) => {
    if (score < 40) return 'text-red-600 font-bold';
    if (score < 70) return 'text-amber-600 font-bold';
    return 'text-green-600 font-bold';
  };

  if (loading) return <div className="p-8 text-center bg-slate-50 min-h-screen">جاري تحميل البيانات...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 rtl font-arabic">
      
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-red-500 font-black">BIK</span>
            لوحة متابعة العملاء
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <span className="text-slate-500 text-sm">إجمالي التشخيصات</span>
          <p className="text-2xl font-bold">{leads.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <span className="text-slate-500 text-sm">التشخيصات الجديدة</span>
          <p className="text-2xl font-bold">{leads.filter(l => l.status === 'new').length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <span className="text-slate-500 text-sm">استشارات حوارية نشطة</span>
          <p className="text-2xl font-bold text-emerald-600">
            {leads.filter(l => {
              const s = l.diagnostic_sessions?.[0];
              return s?.chat_history && Array.isArray(s.chat_history) && s.chat_history.length > 0;
            }).length}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-3 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="بحث باسم الشركة أو العميل..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:border-red-400"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none text-sm">
            <option value="الكل">كل الحالات</option>
            <option value="new">جديد</option>
            <option value="contacted">تم التواصل</option>
            <option value="proposal_sent">تم إرسال العرض</option>
            <option value="negotiating">تفاوض</option>
            <option value="closed">تم الإغلاق</option>
            <option value="not_interested">غير مهتم</option>
          </select>
          <select value={sectorFilter} onChange={e => setSectorFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none text-sm">
            <option value="الكل">كل القطاعات</option>
            {uniqueSectors.map((s: any) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={chatFilter} onChange={e => setChatFilter(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none text-sm">
            <option value="الكل">كل الاستشارات</option>
            <option value="بمحادثة">عملاء تفاعلوا مع المستشار</option>
            <option value="بدون">عملاء لم يتفاعلوا</option>
          </select>
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-xl shadow-sm border border-slate-200 text-slate-500">
          لا توجد تشخيصات بعد — أرسل الرابط لأول عميل
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
          <table className="w-full text-right">
            <thead className="bg-slate-50 text-slate-600 text-sm">
              <tr>
                <th className="p-4 font-medium">التاريخ</th>
                <th className="p-4 font-medium">الشركة والعميل</th>
                <th className="p-4 font-medium">القطاع</th>
                <th className="p-4 font-medium">Health Score</th>
                <th className="p-4 font-medium">الحالة</th>
                <th className="p-4 font-medium text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLeads.map(lead => {
                const session = lead.diagnostic_sessions?.[0];
                const report = session?.report;
                const chatHistory = session?.chat_history;
                const chatLength = chatHistory && Array.isArray(chatHistory) ? chatHistory.length : 0;
                
                return (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-slate-500">{new Date(lead.created_at).toLocaleDateString('ar-EG')}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                          {lead.company_name}
                          {chatLength > 0 && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              💬 {chatLength} أسئلة
                            </span>
                          )}
                        </div>
                        <div className="text-slate-500 text-xs">{lead.user_name} • {lead.country}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">{lead.sector_l2}</span>
                    </td>
                    <td className="p-4">
                      {report ? (
                        <span className={getHealthColor(report.health_score)}>{report.health_score}/100</span>
                      ) : (
                        <span className="text-slate-400">غير مكتمل</span>
                      )}
                    </td>
                    <td className="p-4">
                      <select 
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded border-none font-medium cursor-pointer ${getStatusColor(lead.status)}`}
                      >
                        <option value="new">جديد</option>
                        <option value="contacted">تم التواصل</option>
                        <option value="proposal_sent">مجاب</option>
                        <option value="negotiating">تفاوض</option>
                        <option value="closed">تم الإغلاق</option>
                        <option value="not_interested">غير مهتم</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        <a href={`https://wa.me/${lead.whatsapp}`} target="_blank" rel="noreferrer" className="text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-colors" title="واتساب">
                          WA
                        </a>
                        {session && (
                          <button onClick={() => setSelectedReport(session.report)} className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded transition-colors">
                            عرض التقرير
                          </button>
                        )}
                        {chatLength > 0 && (
                          <button 
                            onClick={() => setSelectedChat({
                              companyName: lead.company_name,
                              userName: lead.user_name,
                              whatsapp: lead.whatsapp,
                              chatHistory
                            })} 
                            className="text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded transition-colors font-semibold"
                          >
                            عرض المحادثة
                          </button>
                        )}
                        {session?.proposal && (
                          <button onClick={() => setProposalModal({lead, text: session.proposal})} className="text-red-600 hover:bg-red-50 px-2 py-1 rounded transition-colors font-medium">
                            إرسال عرض
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* REPORT MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setSelectedReport(null)} className="absolute top-4 left-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedReport.headline_diagnosis}</h2>
            <div className="mb-6 flex gap-4">
              <div className="bg-slate-100 p-3 rounded">
                <span className="block text-xs text-slate-500">Score</span>
                <span className={`font-bold ${getHealthColor(selectedReport.health_score)}`}>{selectedReport.health_score}</span>
              </div>
            </div>
            
            <h3 className="font-bold text-lg mb-2 text-red-600">أعلى نقاط عمياء:</h3>
            <ul className="mb-6 space-y-2">
              {selectedReport.blind_spots.map((b: any, i: number) => (
                <li key={i} className="text-sm bg-slate-50 p-2 rounded border border-slate-100">
                  <span className="font-bold">{b.name}</span>: {b.description}
                </li>
              ))}
            </ul>
             <h3 className="font-bold text-lg mb-2 text-blue-600">أولويات التدخل:</h3>
            <ul className="space-y-2">
              {selectedReport.priority_actions.map((pa: any, i: number) => (
                <li key={i} className="text-sm border-r-2 border-blue-400 pr-2">
                  <span className="font-bold block">{pa.action}</span>
                  <span className="text-slate-500 text-xs">{pa.expected_impact}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* PROPOSAL MODAL */}
      {proposalModal && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
            <button onClick={() => setProposalModal(null)} className="absolute top-4 left-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">إرسال عرض لـ {proposalModal.lead.company_name}</h2>
            
            <textarea 
              value={proposalModal.text}
              onChange={(e) => setProposalModal({...proposalModal, text: e.target.value})}
              className="w-full h-48 border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:border-red-400 mb-4 resize-none"
            />
            
            <div className="flex gap-2">
              <button onClick={handleSendProposal} className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700">
                إرسال عبر واتساب
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(proposalModal.text);
                  alert('تم النسخ');
                }} 
                className="w-1/3 bg-slate-100 text-slate-700 py-3 rounded-lg font-bold hover:bg-slate-200"
              >
                نسخ النص
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT MODAL */}
      {selectedChat && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative font-arabic">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-900">محادثة المستشار مع العميل</h2>
                <p className="text-xs text-slate-500 mt-1">
                  الشركة: <strong className="text-slate-800">{selectedChat.companyName}</strong> • العميل: <strong className="text-slate-800">{selectedChat.userName}</strong>
                </p>
              </div>
              <button onClick={() => setSelectedChat(null)} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-100 space-y-4">
              {selectedChat.chatHistory.map((msg: any, idx: number) => {
                const isModel = msg.role === 'model';
                const hasReferral = msg.text.includes('[REFERRAL_POINT]');
                const cleanText = msg.text.replace('[REFERRAL_POINT]', '').trim();

                return (
                  <div
                    key={idx}
                    className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm ${
                      isModel
                        ? 'bg-slate-800 text-white ml-auto rounded-tl-none font-arabic'
                        : 'bg-[#EF4444] text-white mr-auto rounded-tr-none font-arabic'
                    }`}
                  >
                    <div className="font-bold text-[10px] uppercase tracking-wider mb-1 text-slate-300">
                      {isModel ? '🤖 المستشار الاستراتيجي' : `👤 ${selectedChat.userName}`}
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed">{cleanText}</p>
                    
                    {hasReferral && (
                      <div className="mt-3 bg-emerald-500/20 border border-emerald-400 rounded-lg p-2.5 text-xs text-emerald-100">
                        🎁 <strong>تم ترشيح عرض الجلسة الاستشارية المجانية لأحمد رمضان في هذا الرد!</strong>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
              <a
                href={`https://wa.me/${selectedChat.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-[#10B981] hover:bg-emerald-600 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2 transition-colors shadow-sm text-center text-sm cursor-pointer"
              >
                <span>تواصل مع {selectedChat.userName} عبر واتساب لمتابعة الاستشارة</span>
              </a>
              <button
                onClick={() => {
                  const fullConversation = selectedChat.chatHistory.map((msg: any) => {
                    const cleanText = msg.text.replace('[REFERRAL_POINT]', '').trim();
                    return `${msg.role === 'model' ? 'مستشار' : selectedChat.userName}: ${cleanText}`;
                  }).join('\n\n');
                  navigator.clipboard.writeText(fullConversation);
                  alert('تم نسخ المحادثة بالكامل لجمع الملاحظات!');
                }}
                className="bg-white border-2 border-slate-200 text-slate-700 px-4 py-3 rounded-lg font-bold hover:bg-slate-100 transition-colors text-sm cursor-pointer"
              >
                نسخ المحادثة
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
