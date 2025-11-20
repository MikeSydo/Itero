import { useNavigate } from "@umijs/max";

export default function CardPage(){
    const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };
  return (
    <div style={{background: '#8e2626', alignContent: 'center', width: 100, height: 100 }}>      
    Test
    </div>
  )
}