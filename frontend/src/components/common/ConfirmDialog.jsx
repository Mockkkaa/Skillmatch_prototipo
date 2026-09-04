import { useState, useEffect } from 'react';
import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  title = '¿Estás seguro?',
  message = 'Esta acción no se puede deshacer.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger', // 'danger' | 'warning' | 'primary'
  onConfirm,
  onCancel,
  withInput = false,
  inputLabel = 'Motivo',
  inputPlaceholder = 'Escribe aquí el motivo...',
  inputRequired = true,
  isLoading = false
}) {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInputValue('');
      setInputError('');
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (withInput && inputRequired && !inputValue.trim()) {
      setInputError('Este campo es obligatorio.');
      return;
    }
    if (withInput) {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
  };

  const btnVariant = type === 'danger' ? 'danger' : type === 'warning' ? 'secondary' : 'primary';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={title}
      maxWidth="480px"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={btnVariant}
            onClick={handleConfirm}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div className="confirm-dialog-content">
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: withInput ? '16px' : '0' }}>
          {message}
        </p>

        {withInput && (
          <div className="form-group" style={{ marginTop: '16px' }}>
            {inputLabel && (
              <label className="form-label">
                {inputLabel} {inputRequired && <span className="required">*</span>}
              </label>
            )}
            <textarea
              className={`form-textarea ${inputError ? 'error' : ''}`}
              placeholder={inputPlaceholder}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (inputError) setInputError('');
              }}
              rows={3}
              autoFocus
            />
            {inputError && <span className="form-error">{inputError}</span>}
          </div>
        )}
      </div>
    </Modal>
  );
}
