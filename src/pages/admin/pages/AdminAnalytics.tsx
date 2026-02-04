import React, { useState } from 'react';
import { Icon } from '@/constants';

import { useSrms } from '@/api/hooks/users';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import {
  Badge,
  Card,
  CardContent,
  IconAvatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import SrmAnalytics from './SrmAnalytics';

const AdminAnalytics: React.FC = () => {
  const [selectedSrmId, setSelectedSrmId] = useState<string | null>(null);

  const { data: srmsData, isLoading: isSrmsLoading, isError } = useSrms();

  if (isSrmsLoading) {
    return <LoadingScreen label="Loading SRMs..." />;
  }

  if (isError) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4">
        <Icon name="error_outline" className="text-5xl text-red-500" />
        <h2 className="text-xl font-black text-white uppercase">Connection Error</h2>
        <p className="text-text-secondary">Failed to fetch SRM list from server</p>
      </div>
    );
  }

  const srms = srmsData?.data || [];

  if (selectedSrmId) {
    const selectedSrm = srms.find((s) => s._id === selectedSrmId);
    return (
      <SrmAnalytics
        srmId={selectedSrmId}
        srmName={selectedSrm?.name}
        onBack={() => setSelectedSrmId(null)}
      />
    );
  }

  return (
    <>
      <div className="selection:bg-primary/30 animate-fade-in-up flex w-full flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl leading-tight font-black tracking-tight text-white uppercase">
              SRM Analytics
            </h2>
            <p className="text-text-secondary text-base">
              Performance monitoring and management for Senior Resource Mentors
            </p>
          </div>
        </div>

        {/* SRM Table Section */}
        <Card className="border-white/5 bg-surface-dark overflow-hidden transition-all duration-300">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-6 pb-2">
              <h3 className="text-lg font-black tracking-tight text-white uppercase">
                Senior Resource Mentors
              </h3>
              <Badge variant="primary" className="tracking-widest uppercase">
                {srms.length} SRMs ACTIVE
              </Badge>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-white/[0.02]">
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="text-text-secondary h-12 w-12 px-6 text-[10px] font-black tracking-widest uppercase">
                      #
                    </TableHead>
                    <TableHead className="text-text-secondary h-12 px-4 text-[10px] font-black tracking-widest uppercase">
                      SRM Details
                    </TableHead>
                    <TableHead className="text-text-secondary h-12 px-4 text-[10px] font-black tracking-widest uppercase">
                      Contact
                    </TableHead>
                    <TableHead className="text-text-secondary h-12 px-4 text-[10px] font-black tracking-widest uppercase text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {srms.map((srm, index) => (
                    <TableRow
                      key={srm._id}
                      className="group hover:bg-white/[0.02] cursor-pointer border-white/5 transition-colors"
                      onClick={() => setSelectedSrmId(srm._id || null)}
                    >
                      <TableCell className="px-6 py-4 font-mono text-xs text-white/30">
                        {String(index + 1).padStart(2, '0')}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <IconAvatar
                            variant="primary"
                            size="sm"
                            className="group-hover:scale-110 transition-transform duration-300"
                          >
                            <Icon name="person" />
                          </IconAvatar>
                          <div className="flex flex-col">
                            <span className="font-black text-white uppercase tracking-tight">
                              {srm.name || 'Unnamed SRM'}
                            </span>
                            <span className="text-[10px] text-text-secondary font-medium lowercase">
                              ID: {srm._id}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <Icon name="mail" className="text-primary text-[14px]" />
                            {srm.email}
                          </div>
                          {srm.phone && (
                            <div className="flex items-center gap-2 text-xs text-text-secondary">
                              <Icon name="call" className="text-primary text-[14px]" />
                              {srm.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-right">
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-background-dark">
                          <Icon name="analytics" className="text-lg" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}

                  {srms.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="rounded-full bg-white/5 p-4 text-white/10">
                            <Icon name="group_off" className="text-4xl" />
                          </div>
                          <p className="text-text-secondary text-sm font-black uppercase tracking-widest">
                            No SRMs Found in System
                          </p>
                          <p className="text-text-secondary/50 text-xs">
                            Add a user with the SRM role to see them here
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminAnalytics;
