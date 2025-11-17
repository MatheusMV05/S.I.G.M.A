import { useState, useRef, FormEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Shield, Clock, CheckCircle, Users, Loader } from 'lucide-react';

const BecomeSigma = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    mensagem: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio (integrar com backend depois)
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset form
    setFormData({
      nome: '',
      empresa: '',
      email: '',
      telefone: '',
      mensagem: ''
    });
  };

  const benefits = [
    { icon: Clock, text: 'Resposta em 24h', color: '#D946EF' },
    { icon: Shield, text: '100% Seguro', color: '#10B981' },
    { icon: CheckCircle, text: 'Sem Compromisso', color: '#9333EA' },
    { icon: Users, text: 'Suporte Dedicado', color: '#F59E0B' }
  ];

  return (
    <section 
      id="seja-sigma"
      ref={ref} 
      className="relative py-32 bg-gradient-to-br from-[#0A0A0A] via-black to-[#1A0A1A] 
               overflow-hidden"
    >
      {/* Purple Glow Background */}
      <div className="absolute inset-0 opacity-30">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/4 w-[600px] h-[600px] 
                   bg-[#D946EF] rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[700px] h-[700px] 
                   bg-[#9333EA] rounded-full blur-[150px]"
        />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full bg-[linear-gradient(#D946EF_1px,transparent_1px),linear-gradient(90deg,#D946EF_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
          >
            <span className="text-white">Seja </span>
            <motion.span
              className="inline-block text-transparent bg-clip-text 
                       bg-gradient-to-r from-[#D946EF] to-[#9333EA]"
              animate={{
                textShadow: [
                  '0 0 20px rgba(217,70,239,0.5)',
                  '0 0 40px rgba(217,70,239,0.8)',
                  '0 0 20px rgba(217,70,239,0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              SIGMA
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto"
          >
            Solicite uma demonstração gratuita e veja como transformar 
            a gestão do seu negócio
          </motion.p>
        </motion.div>

        {/* Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          {!isSuccess ? (
            <div className="bg-[#0A0A0A] border border-[#1F1F23] rounded-2xl 
                          p-6 sm:p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Grid 2 colunas */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                      Nome Completo *
                    </label>
                    <motion.input
                      type="text"
                      whileFocus={{ 
                        scale: 1.01,
                        borderColor: '#D946EF'
                      }}
                      className="w-full px-4 py-3 bg-black border border-[#1F1F23] 
                               rounded-xl text-white placeholder-[#52525B]
                               focus:outline-none focus:border-[#D946EF] 
                               focus:shadow-[0_0_20px_rgba(217,70,239,0.2)]
                               transition-all duration-300"
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>

                  {/* Empresa */}
                  <div>
                    <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                      Nome da Empresa *
                    </label>
                    <motion.input
                      type="text"
                      whileFocus={{ 
                        scale: 1.01,
                        borderColor: '#D946EF'
                      }}
                      className="w-full px-4 py-3 bg-black border border-[#1F1F23] 
                               rounded-xl text-white placeholder-[#52525B]
                               focus:outline-none focus:border-[#D946EF]
                               focus:shadow-[0_0_20px_rgba(217,70,239,0.2)]
                               transition-all duration-300"
                      placeholder="Nome do seu negócio"
                      value={formData.empresa}
                      onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Email e Telefone */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                      Email *
                    </label>
                    <motion.input
                      type="email"
                      whileFocus={{ scale: 1.01, borderColor: '#D946EF' }}
                      className="w-full px-4 py-3 bg-black border border-[#1F1F23] 
                               rounded-xl text-white placeholder-[#52525B]
                               focus:outline-none focus:border-[#D946EF]
                               focus:shadow-[0_0_20px_rgba(217,70,239,0.2)]
                               transition-all"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                      Telefone *
                    </label>
                    <motion.input
                      type="tel"
                      whileFocus={{ scale: 1.01, borderColor: '#D946EF' }}
                      className="w-full px-4 py-3 bg-black border border-[#1F1F23] 
                               rounded-xl text-white placeholder-[#52525B]
                               focus:outline-none focus:border-[#D946EF]
                               focus:shadow-[0_0_20px_rgba(217,70,239,0.2)]
                               transition-all"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                {/* Mensagem */}
                <div>
                  <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                    Mensagem (opcional)
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01, borderColor: '#D946EF' }}
                    rows={4}
                    className="w-full px-4 py-3 bg-black border border-[#1F1F23] 
                             rounded-xl text-white placeholder-[#52525B]
                             focus:outline-none focus:border-[#D946EF]
                             focus:shadow-[0_0_20px_rgba(217,70,239,0.2)]
                             transition-all resize-none"
                    placeholder="Conte-nos sobre suas necessidades..."
                    value={formData.mensagem}
                    onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
                  />
                </div>

                {/* Botão Submit */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-[#D946EF] text-white font-semibold 
                           rounded-xl shadow-[0_0_30px_rgba(217,70,239,0.4)]
                           hover:shadow-[0_0_50px_rgba(217,70,239,0.6)]
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-300 flex items-center 
                           justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader className="w-5 h-5" />
                      </motion.div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      Solicitar Demonstração
                      <Send className="w-5 h-5" />
                    </>
                  )}
                </motion.button>

                {/* Info de Segurança */}
                <div className="flex items-start gap-3 pt-4 text-sm text-[#A1A1AA]">
                  <Shield className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <p>
                    Seus dados estão protegidos. Não compartilhamos suas 
                    informações com terceiros. Resposta garantida em até 24 horas.
                  </p>
                </div>
              </form>
            </div>
          ) : (
            // Estado de Sucesso
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0A0A0A] border border-[#10B981]/30 rounded-2xl 
                       p-12 text-center shadow-[0_0_50px_rgba(16,185,129,0.2)]"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-[#10B981]/20 rounded-full 
                         flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-12 h-12 text-[#10B981]" />
              </motion.div>

              <h3 className="text-3xl font-bold text-white mb-4">
                Solicitação Enviada!
              </h3>

              <p className="text-[#A1A1AA] mb-8">
                Obrigado pelo interesse no SIGMA. Nossa equipe entrará em 
                contato em até 24 horas para agendar sua demonstração personalizada.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSuccess(false)}
                className="px-6 py-3 bg-[#D946EF] text-white rounded-xl 
                         font-medium hover:bg-[#C026D3] transition-colors"
              >
                Enviar Outra Solicitação
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Benefícios abaixo do form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.9 + (index * 0.1) }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${item.color}20` }}
              >
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <span className="text-sm font-medium text-[#A1A1AA]">
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BecomeSigma;
