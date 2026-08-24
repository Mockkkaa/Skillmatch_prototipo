export default function Card({ children, className = '', interactive = false, ...props }) {
  return (
    <div 
      className={`card ${interactive ? 'card-interactive' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ children, className = '', ...props }) {
  return <div className={`card-header ${className}`} {...props}>{children}</div>;
};

Card.Body = function CardBody({ children, className = '', ...props }) {
  return <div className={`card-body ${className}`} {...props}>{children}</div>;
};

Card.Footer = function CardFooter({ children, className = '', ...props }) {
  return <div className={`card-footer ${className}`} {...props}>{children}</div>;
};
