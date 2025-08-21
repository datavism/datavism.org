'use client'

import { Twitter, Github, Mail, MessageCircle, Shield, AlertTriangle } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 text-yellow-400 glitch-text">
            SECURE CONTACT
          </h1>
          <p className="text-xl text-green-300 max-w-2xl mx-auto">
            Multiple ways to reach us, from public channels to secure whistleblower communications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Standard Channels */}
          <section>
            <div className="bg-black/50 border border-green-400/30 p-8">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle className="text-green-400" size={32} />
                <h2 className="text-2xl font-bold text-green-400">STANDARD CHANNELS</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-green-950/20 border border-green-400/20">
                  <Twitter className="text-blue-400" size={24} />
                  <div>
                    <div className="font-bold text-green-400">Twitter</div>
                    <div className="text-green-300">@datavism</div>
                    <div className="text-xs text-green-400/60">Public announcements & updates</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-950/20 border border-green-400/20">
                  <MessageCircle className="text-purple-400" size={24} />
                  <div>
                    <div className="font-bold text-green-400">Discord</div>
                    <div className="text-green-300">discord.gg/datavism</div>
                    <div className="text-xs text-green-400/60">Community discussions</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-950/20 border border-green-400/20">
                  <Mail className="text-yellow-400" size={24} />
                  <div>
                    <div className="font-bold text-green-400">Email</div>
                    <div className="text-green-300">ghost@datavism.org</div>
                    <div className="text-xs text-green-400/60">General inquiries</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-950/20 border border-green-400/20">
                  <Github className="text-gray-400" size={24} />
                  <div>
                    <div className="font-bold text-green-400">GitHub</div>
                    <div className="text-green-300">github.com/datavism</div>
                    <div className="text-xs text-green-400/60">Open source code</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-cyan-950/20 border border-cyan-400/30">
                <h3 className="font-bold text-cyan-400 mb-2">Partnership Inquiries</h3>
                <p className="text-sm text-green-300 mb-2">
                  For media, funding, or institutional partnerships:
                </p>
                <div className="text-cyan-300">hello@datavism.org</div>
              </div>
            </div>
          </section>

          {/* Whistleblower Channels */}
          <section>
            <div className="bg-black/50 border border-red-500 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="text-red-500" size={32} />
                <h2 className="text-2xl font-bold text-red-500">WHISTLEBLOWER CHANNELS</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-red-950/20 border border-red-400/20">
                  <Shield className="text-red-400" size={24} />
                  <div>
                    <div className="font-bold text-red-400">SecureDrop</div>
                    <div className="text-red-300 text-sm">[Via Tor Browser Only]</div>
                    <div className="text-xs text-red-400/60">Maximum anonymity</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-red-950/20 border border-red-400/20">
                  <MessageCircle className="text-red-400" size={24} />
                  <div>
                    <div className="font-bold text-red-400">Signal</div>
                    <div className="text-red-300">+49-XXX-ENCRYPTED</div>
                    <div className="text-xs text-red-400/60">End-to-end encryption</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-red-950/20 border border-red-400/20">
                  <Mail className="text-red-400" size={24} />
                  <div>
                    <div className="font-bold text-red-400">ProtonMail</div>
                    <div className="text-red-300">ghost@protonmail.com</div>
                    <div className="text-xs text-red-400/60">Encrypted email</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-950/20 border border-yellow-500/50">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="text-yellow-500" size={20} />
                  <span className="font-bold text-yellow-500">SECURITY NOTICE</span>
                </div>
                <div className="text-xs text-yellow-300 leading-relaxed space-y-2">
                  <p>• Use Tor browser for maximum anonymity</p>
                  <p>• Never use work/personal computers</p>
                  <p>• Always verify PGP signatures</p>
                  <p>• We never store IP addresses or metadata</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Additional Information */}
        <section className="mt-16">
          <div className="bg-black/50 border border-green-400/30 p-8">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">
              SECURITY & PRIVACY
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 text-sm">
              <div>
                <h3 className="font-bold text-green-400 mb-3">Our Commitment</h3>
                <ul className="space-y-2 text-green-300">
                  <li>• No tracking cookies or analytics</li>
                  <li>• Zero data retention on communications</li>
                  <li>• All code is open source</li>
                  <li>• Regular security audits</li>
                  <li>• Hosted in privacy-friendly jurisdictions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-green-400 mb-3">Legal Protection</h3>
                <ul className="space-y-2 text-green-300">
                  <li>• Registered as non-profit organization</li>
                  <li>• Whistleblower protection laws apply</li>
                  <li>• International legal support network</li>
                  <li>• Anonymous contribution rights</li>
                  <li>• Shield laws in multiple jurisdictions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="mt-12 text-center">
          <div className="bg-red-950/30 border border-red-500/50 p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-red-400 mb-3">EMERGENCY CONTACT</h3>
            <p className="text-red-300 text-sm mb-4">
              If you believe you're in immediate danger due to information you possess:
            </p>
            <div className="text-red-400 font-mono">
              Signal: +1-XXX-EMERGENCY
            </div>
            <div className="text-xs text-red-400/60 mt-2">
              24/7 response team • International support network
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}