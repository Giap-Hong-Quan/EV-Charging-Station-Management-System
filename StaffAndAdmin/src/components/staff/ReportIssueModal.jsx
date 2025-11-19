import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ReportIssueModal = ({ open, onOpenChange }) => {
  const [issueForm, setIssueForm] = useState({
    chargerId: '',
    issueType: '',
    description: '',
    images: null
  });

  const chargers = ['A01', 'A02', 'B01', 'B02', 'C01', 'C02', 'C03', 'C04'];
  const issueTypes = ['Lỗi phần cứng', 'Lỗi phần mềm', 'Hỏng cổng sạc', 'Khác'];

  const handleReportIssue = () => {
    console.log('Báo cáo sự cố:', issueForm);
    onOpenChange(false);
    // Reset form
    setIssueForm({
      chargerId: '',
      issueType: '',
      description: '',
      images: null
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Wrench className="w-6 h-6 text-red-600" />
            Báo cáo sự cố
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="issueChargerId">Điểm sạc gặp sự cố</Label>
            <Select
              value={issueForm.chargerId}
              onValueChange={(value) => setIssueForm({ ...issueForm, chargerId: value })}
            >
              <SelectTrigger id="issueChargerId">
                <SelectValue placeholder="-- Chọn điểm sạc --" />
              </SelectTrigger>
              <SelectContent>
                {chargers.map((charger) => (
                  <SelectItem key={charger} value={charger}>
                    Điểm sạc {charger}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="issueType">Loại sự cố</Label>
            <Select
              value={issueForm.issueType}
              onValueChange={(value) => setIssueForm({ ...issueForm, issueType: value })}
            >
              <SelectTrigger id="issueType">
                <SelectValue placeholder="-- Chọn loại sự cố --" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Mô tả chi tiết</Label>
            <Textarea
              id="description"
              placeholder="Mô tả chi tiết sự cố đang gặp phải..."
              value={issueForm.description}
              onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="images">Đính kèm ảnh (tùy chọn)</Label>
            <Input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setIssueForm({ ...issueForm, images: e.target.files })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Chụp ảnh màn hình lỗi hoặc tình trạng thiết bị
            </p>
          </div>

          <Alert className="bg-yellow-50 border-yellow-300">
            <AlertDescription className="text-yellow-800 text-sm">
              ⚠️ Sự cố sẽ được gửi ngay đến Admin và kỹ thuật viên
            </AlertDescription>
          </Alert>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700" 
            onClick={handleReportIssue}
            disabled={!issueForm.chargerId || !issueForm.issueType || !issueForm.description}
          >
            Gửi báo cáo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueModal;