import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { sectors } from '../data/sectors';
import { useDiagnosticStore } from '../store/diagnosticStore';
import { trackEvent } from '../services/supabase';
import { colloquialSearchItems, normalizeArabic } from '../data/colloquialKeywords';

const SectorSelect: React.FC = () => {
  const navigate = useNavigate();
  const { sectorL1, setField, sessionId } = useDiagnosticStore();
  const [selectedL1, setSelectedL1] = useState<string>(sectorL1 || '');
  const [searchQuery, setSearchQuery] = useState('');
  const l2ContainerRef = useRef<HTMLDivElement>(null);

  const searchResults = React.useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return [];
    const normalizedQuery = normalizeArabic(trimmed);
    
    // Split query by spaces to allow multi-word matching
    const queryParts = normalizedQuery.split(/\s+/).filter(Boolean);
    if (queryParts.length === 0) return [];

    return colloquialSearchItems.filter(item => {
      const normalizedL2 = normalizeArabic(item.sectorL2);
      const normalizedLabel = normalizeArabic(item.sectorLabel);
      const normalizedKeywords = item.keywords.map(normalizeArabic);

      // A match is when ALL query parts match somewhere in either sectorL2, sectorLabel, or keywords
      return queryParts.every(part => {
        return (
          normalizedL2.includes(part) ||
          normalizedLabel.includes(part) ||
          normalizedKeywords.some(kw => kw.includes(part))
        );
      });
    });
  }, [searchQuery]);

  const handleSearchResultClick = (item: typeof colloquialSearchItems[0]) => {
    // Set selectedL1 in local state
    setSelectedL1(item.sectorL1);
    
    // Update store fields
    setField('sectorL1', item.sectorL1);
    setField('sectorL2', item.sectorL2);
    setField('currentStep', 'intake');
    
    // Track events
    trackEvent(sessionId, 'search_sector_selected', {
      query: searchQuery,
      sector_l1: item.sectorL1,
      sector_l2: item.sectorL2
    }).catch(console.error);

    trackEvent(sessionId, 'sector_l1_selected', { sector_id: item.sectorL1 }).catch(console.error);
    trackEvent(sessionId, 'sector_l2_selected', { 
      sector_l1: item.sectorL1, 
      sector_l2: item.sectorL2 
    }).catch(console.error);
    
    // Clear search query
    setSearchQuery('');
    
    // Navigate directly to diagnostic depth screen
    setTimeout(() => {
      navigate('/diagnostic-depth');
    }, 250);
  };

  const handleL1Select = (sectorId: string) => {
    setSelectedL1(sectorId);
    setField('sectorL1', sectorId);
    setField('sectorL2', ''); // Reset L2 when L1 changes
    trackEvent(sessionId, 'sector_l1_selected', { sector_id: sectorId }).catch(console.error);
    
    // Scroll to L2 options after a short delay
    setTimeout(() => {
      l2ContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleL2Select = (subsector: string) => {
    setField('sectorL2', subsector);
    setField('currentStep', 'intake');
    trackEvent(sessionId, 'sector_l2_selected', { 
      sector_l1: selectedL1, 
      sector_l2: subsector 
    }).catch(console.error);
    
    setTimeout(() => {
      navigate('/diagnostic-depth');
    }, 300);
  };

  const selectedSectorObj = sectors.find(s => s.id === selectedL1);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col p-4 md:p-8 rtl font-arabic pb-20">
      
      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto w-full mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[#64748B]">الخطوة 1 من 5</span>
          <span className="text-sm font-bold text-[#0F172A]">20%</span>
        </div>
        <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden flex flex-row-reverse">
          <div className="bg-[#EF4444] h-full transition-all duration-500 ease-out w-[20%]"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1">
        
        {/* Header */}
        <div className="mb-10 text-center md:text-right">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-3">ما قطاع نشاطك؟</h1>
          <p className="text-[#64748B] text-lg">اختر الأقرب لطبيعة عملك أو ابحث بالكلمة الدارجة لمجالك</p>
        </div>

        {/* Search Input and Results */}
        <div className="relative mb-8 max-w-xl mx-auto md:mr-0 md:ml-auto">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="مثال: ورشة ميكانيكا، كوافير حريمي، سوبر ماركت، ماركتنج..."
              className="w-full bg-white text-[#0F172A] placeholder-[#94A3B8] pr-12 pl-10 py-4 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EF4444] focus:ring-2 focus:ring-red-100 transition-all text-base font-medium shadow-sm text-right"
              dir="rtl"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <Search className="h-5 w-5" />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {searchQuery.trim().length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-100 max-h-[320px] overflow-y-auto overflow-hidden divide-y divide-slate-50"
              >
                {searchResults.length > 0 ? (
                  searchResults.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchResultClick(item)}
                      className="w-full text-right p-4 hover:bg-slate-50 flex items-center justify-between transition-colors group"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-[#0F172A] group-hover:text-[#EF4444] transition-colors text-base">
                          {item.sectorL2}
                        </span>
                        <span className="text-xs text-[#64748B] flex items-center gap-1">
                          <span>في قطاع {item.sectorLabel}</span>
                          <span>{item.sectorIcon}</span>
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-[#EF4444] opacity-0 group-hover:opacity-100 transition-all pl-2">
                        اختر ومتابعة ←
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-[#64748B]">
                    <span className="block text-3xl mb-2">🔍</span>
                    <p className="font-bold mb-1 text-[#334155]">لم نجد نتائج تطابق "{searchQuery}"</p>
                    <p className="text-xs">جرب البحث بكلمة أبسط أو اختر من الأقسام المتاحة بالأسفل</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* L1 Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {sectors.map((sector) => {
            const isSelected = selectedL1 === sector.id;
            return (
              <motion.div
                key={sector.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleL1Select(sector.id)}
                className={`
                  bg-white rounded-xl p-5 cursor-pointer flex flex-col items-center justify-center transition-all duration-200 shadow-sm
                  border-2 ${isSelected ? 'border-[#EF4444] bg-red-50' : 'border-transparent hover:border-[#EF4444] hover:shadow-md'}
                `}
              >
                <span className="text-4xl mb-3">{sector.icon}</span>
                <span className="text-center font-medium text-[#0F172A] text-sm md:text-base leading-tight">
                  {sector.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* L2 Selection */}
        <AnimatePresence>
          {selectedL1 && selectedSectorObj && (
            <motion.div
              ref={l2ContainerRef}
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-[#E2E8F0]">
                <h2 className="text-xl font-bold text-[#0F172A] mb-6 inline-flex items-center gap-2">
                  <span className="text-2xl">{selectedSectorObj.icon}</span>
                  حدد أكثر:
                </h2>
                
                <div className="grid gap-3">
                  {selectedSectorObj.subsectors.map((subsector, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <button
                        onClick={() => handleL2Select(subsector)}
                        className="w-full bg-white text-right p-4 rounded-xl border-2 border-transparent hover:border-[#EF4444] hover:shadow-sm transition-all text-[#0F172A] font-medium"
                      >
                        {subsector}
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
};

export default SectorSelect;
