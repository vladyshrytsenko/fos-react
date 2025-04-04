import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { Modal, Button, ModalProps } from "react-bootstrap";
import { Omit, BsPrefixProps } from "react-bootstrap/esm/helpers";
import { JSX } from "react/jsx-runtime";

interface BootstrapModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  content: React.ReactNode; 
}

const BootstrapModal: React.FC<BootstrapModalProps> = ({ show, onHide, title, content }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {content}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BootstrapModal;
