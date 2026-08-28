import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../hook/useAuth';

const SellerProfile = () => {
    const user = useSelector(state => state.auth.user);
    const { handleUpdateProfile } = useAuth();
    const [editing, setEditing] = useState(false);
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        contact: ''
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;
        setProfile({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            contact: user.contact || ''
        });
    }, [user]);

    const handleChange = (key, value) => {
        setProfile(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setError(null);
        setMessage(null);

        if (!profile.firstName || !profile.lastName || !profile.contact) {
            setError('First name, last name and phone are required.');
            return;
        }

        try {
            await handleUpdateProfile({
                firstName: profile.firstName,
                lastName: profile.lastName,
                contact: profile.contact
            });
            setMessage('Store profile updated successfully');
            setEditing(false);
        } catch (err) {
            setError('Unable to update store profile');
        }
    };

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <div className="min-h-screen pb-24" style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}>
                <div className="max-w-5xl mx-auto px-8 lg:px-16 xl:px-24 pt-20">
                    <div className="mb-10 text-center">
                        <span className="text-[10px] uppercase tracking-[0.24em] font-medium" style={{ color: '#C9A96E' }}>
                            Seller Dashboard
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-light mt-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            Store Profile
                        </h1>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
                        <div className="space-y-8">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">Seller First Name</label>
                                    <input
                                        value={profile.firstName}
                                        disabled={!editing}
                                        onChange={e => handleChange('firstName', e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">Seller Last Name</label>
                                    <input
                                        value={profile.lastName}
                                        disabled={!editing}
                                        onChange={e => handleChange('lastName', e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">Store Email (Read-only)</label>
                                    <input
                                        value={user?.email || ''}
                                        disabled
                                        className="mt-2 w-full rounded-2xl border border-[#e4e2df] bg-[#f5f3f0] px-4 py-3 text-sm text-[#1b1c1a]"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63]">Business Phone</label>
                                    <input
                                        value={profile.contact}
                                        disabled={!editing}
                                        onChange={e => handleChange('contact', e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-[#e4e2df] bg-white px-4 py-3 text-sm text-[#1b1c1a]"
                                    />
                                </div>
                            </div>

                            {message && <div className="rounded-3xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}
                            {error && <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
                        </div>

                        <div className="rounded-[2rem] border border-[#e4e2df] bg-white p-8 shadow-[0_18px_50px_rgba(27,28,26,0.06)]">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[#C9A96E]">Store Details</p>
                            <h2 className="mt-4 text-2xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>Seller Profile</h2>
                            <p className="mt-3 text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                Manage your public store information and contact details here.
                            </p>

                            <div className="mt-8 flex gap-3 flex-wrap">
                                {editing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="rounded-full bg-[#1b1c1a] px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-white transition-colors hover:bg-[#3f3f3f]"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={() => setEditing(false)}
                                            className="rounded-full border border-[#e4e2df] bg-white px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-[#1b1c1a] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setEditing(true)}
                                        className="rounded-full border border-[#e4e2df] bg-white px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-medium text-[#1b1c1a] transition-colors hover:border-[#C9A96E] hover:text-[#C9A96E]"
                                    >
                                        Edit Store
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SellerProfile;
