#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/eec0bccf443d6cbff0bd21c9d45c8c3bec35fc4627a64ec36074989ca0856139/contract';
import endContract from '../../snapshots/eec0bccf443d6cbff0bd21c9d45c8c3bec35fc4627a64ec36074989ca0856139/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
  sql,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'RoleChangeLog',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('fromRole', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'character(24)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 24 } },
          }),
          col('reason', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('toRole', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'character(24)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 24 } },
          }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'RoleChangeLog_fromRole_check_2b268713',
            sql`"fromRole" IN ('ADMIN', 'MEMBER')`,
          ),
          checkExpression(
            'RoleChangeLog_reason_check_2ce26f17',
            sql`"reason" IN ('INITIAL', 'LOGIN', 'REFRESH')`,
          ),
          checkExpression(
            'RoleChangeLog_toRole_check_4f6283c9',
            sql`"toRole" IN ('ADMIN', 'MEMBER')`,
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'User',
        columns: [
          col('avatarUrl', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('discordId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('displayName', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'character(24)', {
            notNull: true,
            codecRef: { codecId: 'sql/char@1', typeParams: { length: 24 } },
          }),
          col('lastLoginAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('lastSyncedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('role', 'text', {
            notNull: true,
            default: lit('MEMBER'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('tokenVersion', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('username', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression('User_role_check_ddb31015', sql`"role" IN ('ADMIN', 'MEMBER')`),
        ],
      }),
      this.addUnique({
        schema: 'public',
        table: 'User',
        constraint: 'User_discordId_key',
        columns: ['discordId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'RoleChangeLog',
        index: 'RoleChangeLog_createdAt_idx_9575dbd7',
        columns: ['createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'RoleChangeLog',
        index: 'RoleChangeLog_userId_createdAt_idx_f726f04a',
        columns: ['userId', 'createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'RoleChangeLog',
        index: 'RoleChangeLog_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'User',
        index: 'User_createdAt_idx_9575dbd7',
        columns: ['createdAt'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'User',
        index: 'User_displayName_idx_6daae81f',
        columns: ['displayName'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'RoleChangeLog',
        foreignKey: {
          name: 'RoleChangeLog_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
