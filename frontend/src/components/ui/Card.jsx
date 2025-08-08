import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  title, 
  subtitle, 
  icon: Icon,
  gradient = false,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`
        relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm
        hover:shadow-md transition-all duration-300
        ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : ''}
        ${className}
      `}
    >
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;
