
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ChangePasswordButton() {
  const navigate = useNavigate();
  return (
    <Button type="button" onClick={() => navigate('/password-change')}>
      Passwort ändern
    </Button>
  );
}
