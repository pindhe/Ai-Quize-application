import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Bell, Shield, Smartphone, Globe, Info, Volume2, Moon, Sliders, CheckCircle, AlertTriangle, User, Hash, Edit2, X } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useTranslation } from '../lib/TranslationContext';
import Layout from '../components/Layout';

export default function SettingsPage({ profile }: { profile: UserProfile | null }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [updating, setUpdating] = useState<string | null>(null);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showNameEditor, setShowNameEditor] = useState(false);
  const [tempName, setTempName] = useState(profile?.displayName || '');

  if (!profile) return null;

  const currentSettings = profile.settings || {
    audio: true,
    notifications: true,
    darkMode: true,
    language: 'EN',
    securityProtocol: 'MANDATORY'
  };

  const handleToggle = async (key: string, currentValue: any) => {
    if (!profile.id || updating) return;
    
    setUpdating(key);
    const userRef = doc(db, 'users', profile.id);
    
    try {
      await updateDoc(userRef, {
        [`settings.${key}`]: !currentValue
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${profile.id}/settings/${key}`);
    } finally {
      setUpdating(null);
    }
  };

  const updateLanguage = async (lang: 'EN' | 'JP' | 'DE' | 'SO') => {
    if (!profile.id || updating) return;
    
    setUpdating('language');
    const userRef = doc(db, 'users', profile.id);
    try {
      await updateDoc(userRef, {
        'settings.language': lang
      });
      setShowLanguagePicker(false);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${profile.id}/settings/language`);
    } finally {
      setUpdating(null);
    }
  };

  const toggleSecurity = async () => {
     if (!profile.id || updating) return;
     const next = currentSettings.securityProtocol === 'MANDATORY' ? 'RELAXED' : 'MANDATORY';
     setUpdating('securityProtocol');
     const userRef = doc(db, 'users', profile.id);
     try {
       await updateDoc(userRef, {
         'settings.securityProtocol': next
       });
     } catch (e) {
       handleFirestoreError(e, OperationType.UPDATE, `users/${profile.id}/settings/security`);
     } finally {
       setUpdating(null);
     }
  };

  const handleUpdateName = async () => {
    if (!profile.id || updating || !tempName.trim()) return;
    setUpdating('name');
    const userRef = doc(db, 'users', profile.id);
    try {
      await updateDoc(userRef, {
        displayName: tempName.trim()
      });
      setShowNameEditor(false);
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${profile.id}/displayName`);
    } finally {
      setUpdating(null);
    }
  };

  const settingsGroups = [
    {
      title: t.settings.account,
      items: [
        { 
          id: 'displayName',
          label: t.settings.displayName, 
          icon: User, 
          value: profile.displayName, 
          type: 'edit',
          onClick: () => {
            setTempName(profile.displayName);
            setShowNameEditor(true);
          }
        },
        { 
          id: 'nodeId',
          label: t.settings.nodeId, 
          icon: Hash, 
          value: profile.id?.slice(0, 12).toUpperCase(), 
          type: 'info' 
        },
      ]
    },
    {
      title: t.settings.config,
      items: [
        { 
          id: 'audio',
          label: t.settings.audio, 
          icon: Volume2, 
          value: currentSettings.audio ? 'ENABLED' : 'MUTED', 
          type: 'toggle',
          active: currentSettings.audio,
          onClick: () => handleToggle('audio', currentSettings.audio)
        },
        { 
          id: 'darkMode',
          label: t.settings.darkMode, 
          icon: Moon, 
          value: currentSettings.darkMode ? 'FORCED' : 'LIGHT_CORE', 
          type: 'toggle',
          active: currentSettings.darkMode,
          onClick: () => handleToggle('darkMode', currentSettings.darkMode)
        },
        { 
          id: 'notifications',
          label: t.settings.notifications, 
          icon: Bell, 
          value: currentSettings.notifications ? 'ACTIVE' : 'SILENCED', 
          type: 'toggle',
          active: currentSettings.notifications,
          onClick: () => handleToggle('notifications', currentSettings.notifications)
        },
      ]
    },
    {
      title: t.settings.transfers,
      items: [
        { 
          id: 'language',
          label: t.settings.language, 
          icon: Globe, 
          value: currentSettings.language === 'EN' ? 'ENGLISH' : currentSettings.language === 'JP' ? 'JAPANESE' : currentSettings.language === 'DE' ? 'GERMAN' : 'SOMALI', 
          type: 'select',
          onClick: () => setShowLanguagePicker(true)
        },
        { 
          id: 'region',
          label: t.settings.region, 
          icon: Info, 
          value: 'EU_WEST_2', 
          type: 'info' 
        },
      ]
    },
    {
      title: t.settings.security,
      items: [
        { 
          id: 'securityProtocol',
          label: t.settings.securityProtocol, 
          icon: Shield, 
          value: currentSettings.securityProtocol === 'MANDATORY' ? t.settings.securityMandatory : t.settings.securityRelaxed, 
          type: 'toggle',
          active: currentSettings.securityProtocol === 'MANDATORY',
          onClick: toggleSecurity,
          desc: currentSettings.securityProtocol === 'MANDATORY' ? t.settings.securityMandatoryDesc : t.settings.securityRelaxedDesc
        },
        { 
          id: 'version',
          label: t.settings.version, 
          icon: Smartphone, 
          value: 'v1.0.4-LTS', 
          type: 'info' 
        },
      ]
    }
  ];

  return (
    <Layout profile={profile} title={t.nav.settings}>
      <header className="flex items-center justify-between px-6 py-4">
        <button onClick={() => navigate(-1)} className="text-text-secondary hover:text-brand-cyan transition-colors group">
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary italic">CONFIGURATION_LOCAL</span>
        <div className="w-6 h-6" />
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-8">
        <div className="space-y-1">
            <h2 className="text-3xl font-black text-text-primary tracking-tighter">{t.settings.title}</h2>
            <p className="text-sm font-medium text-text-secondary">{t.settings.subtitle}</p>
        </div>

        <div className="space-y-10 pt-4">
            {settingsGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-4">
                 <h3 className="text-[10px] font-bold text-brand-purple uppercase tracking-[0.2em] pl-2">{group.title}</h3>
                 <div className="main-card overflow-hidden">
                    {group.items.map((item, iIdx) => (
                        <button 
                          key={item.id}
                          onClick={item.onClick}
                          disabled={updating !== null && updating !== item.id && item.type !== 'info'}
                          className={`w-full flex items-center justify-between p-5 ${iIdx !== group.items.length - 1 ? 'border-b border-border-light' : ''} hover:bg-bg-main transition-colors group relative`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-2xl border transition-all ${
                                    item.type === 'toggle' && item.active 
                                    ? 'bg-brand-cyan/10 border-brand-cyan text-brand-cyan' 
                                    : 'bg-surface border-border-light text-text-secondary group-hover:border-brand-cyan group-hover:text-brand-cyan'
                                }`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-sm font-bold text-text-primary tracking-tight leading-none mb-1">{item.label}</span>
                                    {item.desc && (
                                        <span className="text-[10px] font-medium text-text-secondary">
                                            {item.desc}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {updating === item.id ? (
                                    <motion.div 
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                        className="w-4 h-4 border-2 border-brand-cyan border-t-transparent rounded-full"
                                    />
                                ) : (
                                    <div className="flex flex-col items-end">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.1em] transition-colors ${
                                            (item.type === 'toggle' && item.active) || item.type === 'edit' ? 'text-brand-cyan' : 'text-text-secondary'
                                        }`}>
                                            {item.value}
                                        </span>
                                        {item.type === 'edit' && (
                                            <Edit2 className="w-3 h-3 text-text-secondary mt-1 group-hover:text-brand-cyan transition-colors" />
                                        )}
                                        {item.type === 'toggle' && (
                                            <div className={`w-10 h-5 rounded-full mt-2 p-0.5 transition-colors border ${item.active ? 'bg-brand-cyan border-brand-cyan' : 'bg-bg-main border-border-light'}`}>
                                                <motion.div 
                                                    animate={{ x: item.active ? 18 : 0 }}
                                                    className="w-4 h-4 rounded-full bg-white shadow-sm"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                 </div>
              </div>
            ))}
        </div>

        <div className="pt-12 text-center space-y-4 opacity-40">
            <div className="w-12 h-[1.5px] bg-border-light mx-auto" />
            <p className="text-[9px] font-bold text-text-secondary uppercase tracking-[0.4em]">{t.settings.neuralAlias} Deployment<br/>REVISION_v1.0.4-LTS</p>
        </div>

        {/* Language Picker Modal */}
        <AnimatePresence>
            {showLanguagePicker && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowLanguagePicker(false)}
                        className="absolute inset-0 bg-bg-main/90 backdrop-blur-xl"
                    />
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-lg p-6 relative z-10"
                    >
                        <div className="flex flex-col items-center text-center mb-12">
                            <div className="w-16 h-16 rounded-3xl bg-brand-cyan/10 flex items-center justify-center mb-6 border border-brand-cyan/20">
                                <Globe className="w-8 h-8 text-brand-cyan" />
                            </div>
                            <h4 className="text-3xl font-black text-text-primary tracking-tighter italic mb-2">{t.settings.selectInterface}</h4>
                            <p className="text-sm text-text-secondary font-medium">Select your preferred cognitive link language.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'EN', label: 'English', native: 'English', sub: 'Native Protocol' },
                                { id: 'JP', label: '日本語', native: '日本語', sub: 'Japanese Core' },
                                { id: 'DE', label: 'Deutsch', native: 'Deutsch', sub: 'German Node' },
                                { id: 'SO', label: 'Soomaali', native: 'Soomaali', sub: 'Somali Link' }
                            ].map((lang) => (
                                <button 
                                    key={lang.id}
                                    onClick={() => updateLanguage(lang.id as any)}
                                    className={`relative p-6 rounded-[2rem] border-2 flex flex-col items-center justify-center transition-all group gap-2 h-40 ${
                                        currentSettings.language === lang.id 
                                        ? 'bg-brand-cyan/5 border-brand-cyan shadow-xl shadow-brand-cyan/10' 
                                        : 'bg-surface border-border-light hover:border-brand-purple hover:bg-bg-main'
                                    }`}
                                >
                                    <span className={`text-2xl font-black ${currentSettings.language === lang.id ? 'text-brand-cyan' : 'text-text-primary'}`}>
                                        {lang.native}
                                    </span>
                                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">{lang.sub}</span>
                                    
                                    {currentSettings.language === lang.id && (
                                        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-brand-cyan flex items-center justify-center">
                                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={() => setShowLanguagePicker(false)}
                            className="mt-12 w-full py-4 text-xs font-bold text-text-secondary uppercase tracking-widest hover:text-text-primary transition-colors"
                        >
                            {t.common.cancel}
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

        {/* Name Editor Modal */}
        <AnimatePresence>
            {showNameEditor && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowNameEditor(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className="w-full max-w-sm bg-surface border border-border-light rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 relative z-10 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-lg font-black text-text-primary tracking-tight italic">{t.settings.modifyIdentity}</h4>
                            <button onClick={() => setShowNameEditor(false)} className="w-8 h-8 rounded-full bg-bg-main border border-border-light flex items-center justify-center text-text-secondary">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] pl-1">{t.settings.neuralAlias}</label>
                                <input 
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    placeholder="Enter new alias..."
                                    className="w-full h-14 bg-bg-main border border-border-light rounded-2xl px-5 text-sm font-bold focus:ring-2 focus:ring-brand-cyan/20 focus:border-brand-cyan outline-none transition-all"
                                    autoFocus
                                />
                            </div>

                            <button
                                onClick={handleUpdateName}
                                disabled={updating === 'name' || !tempName.trim() || tempName === profile.displayName}
                                className="btn-primary w-full h-14 flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {updating === 'name' ? (
                                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                ) : (
                                    <>
                                        <span className="text-xs font-bold uppercase tracking-widest">{t.settings.updateSegment}</span>
                                        <CheckCircle className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
      </main>
    </Layout>
  );
}
